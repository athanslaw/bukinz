import React from "react";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

// const styles = {
//     control: (base) => ({
//       ...base,
//       minHeight: 32,
//     }),
//     dropdownIndicator: (base) => ({
//       ...base,
//       paddingTop: 0,
//       paddingBottom: 0,
//     }),
//     clearIndicator: (base) => ({
//       ...base,
//       paddingTop: 0,
//       paddingBottom: 0,
//     }),
// };

export default class SelectComponent extends React.Component {
  styles = {
    control: (base) => ({
      ...base,
      minHeight: this.props.minHeight ? this.props.minHeight : 32,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    clearIndicator: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    }),
  };
  state = {
    selectedOption: { label: null, value: null },
  };
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  };
  render() {
    const {
      selectedOption: { value },
    } = this.state;

    return (
      <Select
        value={this.props.options.filter((option) =>
          value
            ? option.value == value
            : option.value == this.props.defaultValue
        )}
        onChange={(event) => {
          this.props.onChange(event);
          this.handleChange(event);
        }}
        options={this.props.options}
      />
      
    );
  }
}
