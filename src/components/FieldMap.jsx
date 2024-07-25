import Checkbox from "./Shared/Checkbox";
import Dropdown from "./Shared/Dropdown";
import Input from "./Shared/Input";
export default function ({ field, state, setState }) {
  console.log(state);
  if (!state.extraFields) return <></>;
  return (
    <div className="field_container">
      <div className="field_info">
        <h4>
          {field.name}
          <span>{field.required && " (required)"}</span>
        </h4>
        <p>{field.info}</p>
      </div>
      {field.inputType == "text" && (
        <Input
          placeholder={field.placeholder}
          onChange={(e) =>
            setState({
              ...state,
              extraFields: {
                ...state.extraFields,
                [field.name]: e.target.value,
              },
            })
          }
          value={state.extraFields[field.name] || ""}
          type={"text"}
        />
      )}
      {field.inputType == "number" && (
        <Input
          placeholder={field.placeholder}
          onChange={(e) =>
            setState({
              ...state,
              extraFields: {
                ...state.extraFields,
                [field.name]: e.target.value,
              },
            })
          }
          value={state.extraFields[field.name] || ""}
          type={"number"}
        />
      )}
      {field.inputType == "dropdown" && (
        <Dropdown
          array={field.options}
          placeholder={field.placeholder || "select a value"}
          value={state.extraFields[field.name]}
          setValue={(v) =>
            setState({
              ...state,
              extraFields: { ...state.extraFields, [field.name]: v },
            })
          }
        ></Dropdown>
      )}
      {field.inputType == "checkbox" && (
        <Checkbox
          checked={state.extraFields[field.name] || false}
          setChecked={(v) =>
            setState({
              ...state,
              extraFields: { ...state.extraFields, [field.name]: v },
            })
          }
        ></Checkbox>
      )}
      {field.inputType == "date" && (
        <Input
          placeholder={field.placeholder}
          onChange={(e) =>
            setState({
              ...state,
              extraFields: {
                ...state.extraFields,
                [field.name]: e.target.value,
              },
            })
          }
          value={state.extraFields[field.name] || ""}
          type={"date"}
        />
      )}
      {field.inputType == "radio" && (
        <div className="options">
          {field.options?.map((option) => (
            <div
              className={
                "radio_option " +
                (state.extraFields[field.name] == option ? "active" : "")
              }
              onClick={() =>
                setState(
                  state.extraFields[field.name] == option
                    ? {
                        ...state,
                        extraFields: { ...state.extraFields, [field.name]: "" },
                      }
                    : {
                        ...state,
                        extraFields: {
                          ...state.extraFields,
                          [field.name]: option,
                        },
                      }
                )
              }
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
