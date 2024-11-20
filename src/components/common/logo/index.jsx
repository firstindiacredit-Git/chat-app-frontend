import LogoP from "./LogoP.png";
const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <img src= {LogoP} className="w-10 h-10" />
           <span style={{
  background: 'linear-gradient(to right,#f74271,#4a89fd)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: '3rem' // Adjust the font size as needed
}}>
  Pizeonfly
</span>
    </div>
  );
};

export default Logo;
