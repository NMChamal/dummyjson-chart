import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Autocomplete,
  TextField,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import type { Category, Product } from "../types";

interface FiltersPanelProps {
  allCategories: Category[];
  productsForCategory: Product[];
  selectedCategory: string | null;
  selectedProducts: Product[];
  onCategoryChange: (event: SelectChangeEvent<string>) => void;
  onProductsChange: (event: React.SyntheticEvent, newValue: Product[]) => void;
  onRunReport: () => void;
  onClear: () => void;
  isReportButtonDisabled: boolean;
  isLoadingReport: boolean;
}

const FiltersPanel = ({
  allCategories,
  productsForCategory,
  selectedCategory,
  selectedProducts,
  onCategoryChange,
  onProductsChange,
  onRunReport,
  onClear,
  isReportButtonDisabled,
  isLoadingReport,
}: FiltersPanelProps) => {
  return (
    <Card className="shadow-lg h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          <Button variant="text" size="small" onClick={onClear}>
            Clear
          </Button>
        </div>

        <div className="flex-grow space-y-6">
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Select Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory || ""}
              label="Select Category"
              onChange={onCategoryChange}
            >
              {allCategories.map((cat) => (
                <MenuItem key={cat.name} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Autocomplete
            multiple
            id="product-selector"
            options={productsForCategory}
            getOptionLabel={(option) => option.title}
            value={selectedProducts}
            onChange={onProductsChange}
            disabled={!selectedCategory}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Select Product"
                placeholder="Products"
              />
            )}
          />
        </div>

        <div className="mt-6">
          <Button
            variant="contained"
            fullWidth
            onClick={onRunReport}
            disabled={isReportButtonDisabled}
            size="large"
          >
            {isLoadingReport ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Run Report"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersPanel;
