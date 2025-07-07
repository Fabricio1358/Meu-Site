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
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Utils
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="/utils/toDo">
                  Lista toDo
                </a>
                <a className="dropdown-item" href="#">
                  Outra ação
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">
                  Algo mais aqui
                </a>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
