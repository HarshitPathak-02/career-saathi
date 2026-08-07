import logo from '../../assets/logo.png'

const BrandLogo = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-35 w-35 items-center justify-center">
        <img src={logo} alt="CareerSaathi Logo" />
      </div>

      <h1 className="text-7xl font-bold tracking-tight text-white">
        CareerSaathi
      </h1>

      <p className="mt-3 text-lg text-slate-400">
        Unburden Your Future. Get Your Direction.
      </p>
    </div>
  );
};

export default BrandLogo;