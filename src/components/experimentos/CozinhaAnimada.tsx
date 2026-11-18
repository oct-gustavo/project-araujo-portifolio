/**
 * Fundo da Cantina Exemplo: a ilustração da cozinha (imagem parada, no CSS) com uma camada leve de animação em SVG por cima:
 * vapor saindo da panela, um sopro maior de vez em quando, folhas de manjericão subindo e a luz da janela "respirando".
 * Só CSS (transform/opacity), sem vídeo. As coordenadas seguem a imagem (2576x1438); `xMaxYMid slice` repete o recorte
 * `right center` do fundo. Com "reduzir movimento" nada se move (regra no experimentos.css).
 */
export function CozinhaAnimada() {
  return (
    <div className="rest-fundo" aria-hidden="true">
      <svg viewBox="0 0 2576 1438" preserveAspectRatio="xMaxYMid slice" focusable="false">
        {/* luz da janela: mesma forma do feixe da imagem, clareando e voltando devagar */}
        <path className="rest-luz" d="M0 0 L930 395 C1050 455 1110 570 1168 1048 L0 1048 Z" />
        {/* vapor contínuo */}
        <g className="rest-vapor">
          <path className="rest-fio rest-fio-1" d="M1800 770 C1840 700 1760 640 1805 560 C1840 490 1790 440 1820 380" />
          <path className="rest-fio rest-fio-2" d="M1885 768 C1925 690 1850 625 1895 545 C1930 470 1880 420 1912 350" />
          <path className="rest-fio rest-fio-3" d="M1965 770 C2000 705 1935 650 1975 575 C2005 505 1960 455 1990 395" />
          <path className="rest-fio rest-fio-4" d="M2030 775 C2062 715 2010 665 2045 600 C2070 540 2030 500 2055 450" />
        </g>
        {/* sopro maior, de vez em quando */}
        <g className="rest-sopro">
          <circle cx="1880" cy="740" r="60" />
          <circle cx="1950" cy="720" r="80" />
          <circle cx="2020" cy="745" r="55" />
        </g>
        {/* folhas de manjericão que sobem da tigela */}
        <path className="rest-folha rest-folha-1" d="M2170 930 C2200 895 2250 900 2262 930 C2230 960 2190 958 2170 930 Z" />
        <path className="rest-folha rest-folha-2" d="M2260 925 C2290 892 2335 898 2345 928 C2318 955 2282 952 2260 925 Z" />
      </svg>
      <div className="rest-fundo-vu" />
    </div>
  )
}
