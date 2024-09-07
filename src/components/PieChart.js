import { Pie } from "react-chartjs-2";
import autocolors from 'chartjs-plugin-autocolors';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
ChartJS.register(Tooltip, Legend, ArcElement, autocolors);

const PieChart = (props) => {
    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
            autocolors: {
                mode: 'dataset'
            },
        },
        responsive: true,
    };

    const pieChartData = {
        labels: props.labels,
        datasets: [
            {
                label: props.title,
                data: props.data,
                borderWidth: 2,
                hoverOffset: 5,
            },
        ],
    };

    return (
        <Pie options={options} data={pieChartData} />
    );
}

export default PieChart;