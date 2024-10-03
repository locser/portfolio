import Footer from "@/components/Footer";
import Grid from "@/components/Grid";
import Hero from "@/components/hero";
import { FloatingNav } from "@/components/ui/floating-navbar";


// const ThemeChanger = () => {
//   const { theme, setTheme } = useTheme()

//   return (
//     <div>
//       The current theme is: {theme}
//       <button onClick={() => setTheme('light')}>Light Mode</button>
//       <button onClick={() => setTheme('dark')}>Dark Mode</button>
//     </div>
//   )
// }

export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5" >
      {/* <ThemeChanger /> */}
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={[
          { name: 'Home', link: '/', icon: undefined },
        ]} />
        <Hero></Hero>
        <Grid />

        <Footer />

      </div>

    </main>

  );
}
