import { useState } from 'react';
import { Plus, Trash2, Check, Calendar, Clock, Filter } from 'lucide-react';

type Todo = {
  id: number;
  text: string;
  date: string;
  estimatedTime: string;
  completed: boolean;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          date: inputDate,
          estimatedTime: inputTime,
          completed: false,
        },
      ]);
      setInputValue('');
      setInputDate('');
      setInputTime('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const isOverdue = (dateString: string | number | Date) => {
    if (!dateString) return false;
    const today = new Date();
    const taskDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const isToday = (dateString: string | number | Date) => {
    if (!dateString) return false;
    const today = new Date();
    const taskDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  };

  const formatDateSection = (dateString: string | number | Date) => {
    if (!dateString) return 'Sem data';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Hoje';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Amanhã';
    } else {
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }
  };

  const groupTasksByDate = (tasks: Todo[]) => {
    const grouped: { [date: string]: Todo[] } = {};

    tasks.forEach((todo: Todo) => {
      const dateKey = todo.date || 'no-date';
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(todo);
    });

    return grouped;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const num = parseFloat(timeString);
    const hours = Math.floor(num);
    const minutes = Math.round((num - hours) * 60);

    if (hours === 0 && minutes > 0) {
      return `${minutes} min`;
    }
    if (hours === 1 && minutes === 0) {
      return '1 hora';
    }
    if (hours > 0 && minutes === 0) {
      return `${hours} horas`;
    }
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    }
    return '';
  };

  const formatTotalTime = (totalHours: number) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);

    if (hours === 0 && minutes > 0) {
      return `${minutes} minutos`;
    }
    if (hours === 1 && minutes === 0) {
      return '1 hora';
    }
    if (hours > 0 && minutes === 0) {
      return `${hours} horas`;
    }
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    }
    return '0 minutos';
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (!filterDate) return true;
      return todo.date === filterDate;
    })
    .sort((a, b) => {
      // Primeiro, tarefas sem data vão para o final
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;

      // Depois, ordena por data (mais próxima primeiro)
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  const groupedTodos = groupTasksByDate(filteredTodos);

  const clearFilter = () => {
    setFilterDate('');
    setShowFilter(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Minhas Tarefas
      </h1>

      <div className="space-y-3 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Adicionar nova tarefa..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tempo (horas)"
            min="0.5"
            step="0.5"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={addTodo}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Adicionar Tarefa
        </button>
      </div>

      {/* Filtro */}
      <div className="mb-4 space-y-2">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Filter size={16} />
          Filtrar por data
        </button>

        {showFilter && (
          <div className="flex gap-2">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filterDate && (
              <button
                onClick={clearFilter}
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Limpar
              </button>
            )}
          </div>
        )}

        {filterDate && (
          <div className="text-sm text-gray-600">
            Mostrando tarefas para {formatDate(filterDate)} (
            {filteredTodos.length} encontrada(s))
          </div>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(groupedTodos).map(([dateKey, todosForDate]) => {
          return (
            <div key={dateKey} className="space-y-2">
              <h2
                className={`text-lg font-semibold flex items-center gap-2 ${
                  dateKey !== 'no-date' && isOverdue(dateKey)
                    ? 'text-red-600'
                    : dateKey !== 'no-date' && isToday(dateKey)
                      ? 'text-blue-600'
                      : 'text-gray-700'
                }`}
              >
                <Calendar size={18} />
                {dateKey === 'no-date'
                  ? 'Sem data'
                  : formatDateSection(dateKey)}
                {dateKey !== 'no-date' &&
                  isOverdue(dateKey) &&
                  !todosForDate.every((t: Todo) => t.completed) && (
                    <span className="text-sm font-normal text-red-600">
                      (Atrasado)
                    </span>
                  )}
                <span className="text-sm font-normal text-gray-500">
                  ({todosForDate.length} tarefa
                  {todosForDate.length !== 1 ? 's' : ''})
                </span>
              </h2>

              <ul className="space-y-2 ml-6">
                {todosForDate.map((todo: Todo) => (
                  <li
                    key={todo.id}
                    className={`p-3 rounded-lg border-l-4 transition-all ${
                      todo.completed
                        ? 'bg-gray-100 border-green-500'
                        : isOverdue(todo.date) && !isToday(todo.date)
                          ? 'bg-red-50 border-red-500'
                          : 'bg-gray-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
                          todo.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {todo.completed && <Check size={16} />}
                      </button>

                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            todo.completed
                              ? 'text-gray-500 line-through'
                              : 'text-gray-800'
                          }`}
                        >
                          {todo.text}
                        </h3>

                        {todo.estimatedTime && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                            <Clock size={14} />
                            {formatTime(todo.estimatedTime)}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {filteredTodos.length === 0 && todos.length === 0 && (
        <p className="text-gray-500 text-center mt-6">
          Nenhuma tarefa ainda. Adicione uma acima!
        </p>
      )}

      {filteredTodos.length === 0 && todos.length > 0 && (
        <p className="text-gray-500 text-center mt-6">
          Nenhuma tarefa encontrada para esta data.
        </p>
      )}

      {filteredTodos.length > 0 && (
        <div className="mt-6 space-y-2 text-sm text-gray-600">
          <div className="text-center">
            {filteredTodos.filter((todo) => !todo.completed).length} de{' '}
            {filteredTodos.length} tarefas restantes
          </div>

          {filteredTodos.filter(
            (todo) => !todo.completed && isOverdue(todo.date)
          ).length > 0 && (
            <div className="text-center text-red-600 font-medium">
              {
                filteredTodos.filter(
                  (todo) => !todo.completed && isOverdue(todo.date)
                ).length
              }{' '}
              tarefa(s) atrasada(s)
            </div>
          )}

          {filteredTodos.filter((todo) => !todo.completed && todo.estimatedTime)
            .length > 0 && (
            <div className="text-center text-blue-600">
              Tempo total estimado:{' '}
              {formatTotalTime(
                filteredTodos
                  .filter((todo) => !todo.completed && todo.estimatedTime)
                  .reduce(
                    (total, todo) => total + parseFloat(todo.estimatedTime),
                    0
                  )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
