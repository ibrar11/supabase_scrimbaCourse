import { useState, useEffect } from 'react';

type MetricType = {
  name: string
  total_sales: number
}

type FormType = {
  metrics: MetricType[]
}

function Form({ metrics }: FormType) {

  const [newDeal, setNewDeal] = useState({
    name: '',
    value: 0,
  });

  useEffect(() => {
    if (metrics && metrics.length > 0) {
      setNewDeal({
        name: metrics[0].name,
        value: 0,
      });
    }
  }, [metrics]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const eventName = event.target.name;
    const eventValue = event.target.value;
    setNewDeal(prevState => ({...prevState, [eventName]: eventValue}));
  }
  
  const generateOptions = () => {
    return metrics.map((metric) => (
      <option key={metric.name} value={metric.name}>
        {metric.name}
      </option>
    ));
  };
 
 return (
	 <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>Name:
          <select value={newDeal.name} onChange={handleChange} name="name">
            {generateOptions()}
          </select>
        </label>
        <label>Amount: $
          <input
            type="number"
            name="value"
            value={newDeal.value}
            onChange={handleChange}
            className="amount-input"
            min="0"
            step="10"
          />
        </label>
        <button>Add Deal</button>
      </form>
    </div>
  );
}

export default Form;