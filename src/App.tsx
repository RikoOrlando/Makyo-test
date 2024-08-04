import "./App.css";
import Select from "./components/Select/Select";

function App() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-[500px]">
        <Select searchPlaceholder="search" options={[]} placeholder="Select" />
      </div>
    </div>
  );
}

export default App;
