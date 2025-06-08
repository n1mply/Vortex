import { useEffect, useMemo, useState, memo  } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";


function ParticlesBackground({}) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);

    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const options = useMemo(
    () => ({
      fullScreen: { enable: false }, 
      background: {
          color: {
            value: "#1e1e1e", // чёрный фон — космос
          },
        },
        fpsLimit: 60, // ограничение по FPS
        interactivity: {
          events: {
            onClick: { enable: false }, // при клике ничего не происходит
            onHover: { enable: false }, // при наведении ничего не происходит
          },
        },
        particles: {
          color: {
            value: ["#ffffff", "#a244ff"], // белые и голубые "звёзды"
          },
          move: {
            direction: "none", // случайное движение
            enable: true,
            outModes: {
              default: "out", // частицы выходят за границу и перерисовываются
            },
            random: true,
            speed: 0.2, // медленное движение (звёзды не должны "летать" быстро)
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800, // плотность распределения
            },
            value: 300, // количество частиц
          },
          opacity: {
            value: { min: 0.1, max: 0.8 }, // разные уровни прозрачности
          },
          shape: {
            type: "circle", // форма — кружок (звёздочка)
          },
          size: {
            value: { min: 1, max: 3 }, // разные размеры "звёзд"
          },
        },
        detectRetina: true, // поддержка Retina-дисплеев
    }),
    [],
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        className="particles-canvas" 
      />
    );
  }

  return <></>;
};


export default memo(ParticlesBackground);