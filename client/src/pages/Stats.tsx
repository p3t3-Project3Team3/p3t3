
const Stats = () => {
    const Profile = JSON.parse(localStorage.getItem('profile') || '{}');
    if (!Profile || !Profile.username) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">{Profile.username}'s Stats</h1>
      <h2 className=''>Best time for  Matching</h2>
      <p className="text-lg">⭐{}</p>
      <h2 className=''>Best time for  Crossword</h2>
      <p className="text-lg">⭐{}</p>
    </div>
  );
}
export default Stats;