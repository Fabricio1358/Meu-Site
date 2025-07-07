import Header from '../../components/header/header';
import TodoList from '../../utils/toDo/toDo';
import './home.css';

export default function Home() {
  return (
    <>
      <Header nome="Menu" />
      <div className="content_main">
        <TodoList />
      </div>
    </>
  );
}
