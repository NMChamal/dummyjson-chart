import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardContent, CircularProgress } from "@mui/material";

interface ChartDisplayProps {
  chartOptions: Highcharts.Options | null;
  isLoading: boolean;
}

const ChartDisplay = ({ chartOptions, isLoading }: ChartDisplayProps) => {
  return (
    <Card className="shadow-lg h-full">
      <CardContent className="p-6 h-full flex flex-col justify-center items-center">
        {isLoading && (
          <div className="text-center">
            <CircularProgress size={60} />
            <p className="mt-4 text-gray-600">Generating Report...</p>
          </div>
        )}
        {!isLoading && chartOptions && (
          <div className="w-full h-[500px]">
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            <p className="text-center text-sm text-gray-500 mt-4">
              The chart shows the price of all selected products in the selected
              category
            </p>
          </div>
        )}
        {!isLoading && !chartOptions && (
          <div className="text-center text-gray-500">
            <p>Select a category and click "Run Report" to view data.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartDisplay;
