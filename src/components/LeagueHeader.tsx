interface LeagueHeaderProps {
  leagueName: string;
}

const LeagueHeader: React.FC<LeagueHeaderProps> = ({ leagueName }) => {
  return (
    <div className="mb-4 text-4md font-extrabold leading-none tracking-tight text-gray-900 md:text-4md md:text-6md dark:text-white">
      <hr />
      <div>{leagueName}</div>
    </div>
  );
};

export default LeagueHeader;
