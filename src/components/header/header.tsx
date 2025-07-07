import './header.css';

type HeaderProps = {
  nome: string;
};

export default function Header({ nome }: HeaderProps) {
  return (
    <>
      <div className="header">
        <nav className="navbar">
          <ul>
            <li>
              <a href="#" id="a_main">
                {nome}
              </a>
            </li>
            <li>
              <a href="/home">Início</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
