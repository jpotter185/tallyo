#!/usr/bin/env ruby
# frozen_string_literal: true

require "yaml"

input_path = ARGV[0]
output_path = ARGV[1]

if input_path.nil? || output_path.nil?
  warn "Usage: ruby scripts/generate-api-types.rb <openapi.yaml> <output.ts>"
  exit 1
end

unless File.exist?(input_path)
  warn "OpenAPI file not found: #{input_path}"
  exit 1
end

doc = YAML.load_file(input_path)
schemas = doc.dig("components", "schemas") || {}

primitive_map = {
  "string" => "string",
  "integer" => "number",
  "number" => "number",
  "boolean" => "boolean",
}

def indent(level)
  "  " * level
end

def ts_type_for(schema, primitive_map, required: false, level: 0)
  return "unknown" if schema.nil? || !schema.is_a?(Hash)

  if schema["$ref"]
    ref_name = schema["$ref"].split("/").last
    return "components[\"schemas\"][\"#{ref_name}\"]"
  end

  if schema["enum"].is_a?(Array) && !schema["enum"].empty?
    return schema["enum"].map { |value| value.is_a?(String) ? "\"#{value}\"" : value.inspect }.join(" | ")
  end

  if schema["oneOf"].is_a?(Array)
    return schema["oneOf"].map { |item| ts_type_for(item, primitive_map, level: level) }.join(" | ")
  end

  if schema["anyOf"].is_a?(Array)
    return schema["anyOf"].map { |item| ts_type_for(item, primitive_map, level: level) }.join(" | ")
  end

  type = schema["type"]
  case type
  when "array"
    items = schema["items"].is_a?(Hash) ? schema["items"] : {}
    return "(#{ts_type_for(items, primitive_map, level: level)})[]"
  when "object"
    if schema["additionalProperties"].is_a?(Hash)
      value_type = ts_type_for(schema["additionalProperties"], primitive_map, level: level)
      return "{ [key: string]: #{value_type} }"
    end

    properties = schema["properties"]
    return "Record<string, unknown>" unless properties.is_a?(Hash)

    required_props = (schema["required"] || []).to_set
    lines = ["{"]
    properties.each do |name, prop_schema|
      optional = required_props.include?(name) ? "" : "?"
      prop_type = ts_type_for(prop_schema, primitive_map, required: required_props.include?(name), level: level + 1)
      lines << "#{indent(level + 1)}\"#{name}\"#{optional}: #{prop_type};"
    end
    lines << "#{indent(level)}}"
    return lines.join("\n")
  else
    return primitive_map.fetch(type, "unknown")
  end
end

require "set"

output_lines = []
output_lines << "// AUTO-GENERATED FILE. DO NOT EDIT."
output_lines << "// Generated from OpenAPI schema. Run `npm run gen:api-types`."
output_lines << ""
output_lines << "export interface components {"
output_lines << "  schemas: {"

schemas.each do |name, schema|
  schema_type = ts_type_for(schema, primitive_map, level: 2)
  schema_declaration =
    if schema_type.include?("\n")
      schema_type.lines.map.with_index do |line, idx|
        idx.zero? ? "    \"#{name}\": #{line}" : "    #{line}"
      end.join
    else
      "\"#{name}\": #{schema_type};"
    end

  if schema_declaration.end_with?("}")
    schema_declaration += ";"
  end

  output_lines << "    #{schema_declaration}".gsub("    \"#{name}\":     ", "    \"#{name}\": ")
end

output_lines << "  };"
output_lines << "}"
output_lines << ""

File.write(output_path, output_lines.join("\n"))
puts "Generated #{output_path} from #{input_path}"
