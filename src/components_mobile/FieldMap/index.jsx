import Checkbox from "../shared/Checkbox";
import Dropdown from "../shared/Dropdown";
import Input from "../shared/Input";
import "./index.css";

function FieldMap({ field, state, setState }) {
  return (
    <div className="mobile_field_container">
      {field.inputType == "text" && (
        <Input
          info={field.info}
          required={field.required}
          label={field.name}
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
      {field.inputType == "number" && (
        <Input
          info={field.info}
          required={field.required}
          label={field.name}
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
      {field.inputType == "dropdown" && (
        <Dropdown
          info={field.info}
          required={field.required}
          label={field.name}
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
        <div className="checkbox_container">
          <Checkbox
            required={field.required}
            label={field.name}
            checked={state.extraFields[field.name] || false}
            setChecked={(v) =>
              setState({
                ...state,
                extraFields: { ...state.extraFields, [field.name]: v },
              })
            }
          ></Checkbox>
          <label className="mobile_input_label">{field.name}</label>
        </div>
      )}
      {field.inputType == "date" && (
        <Input
          info={field.info}
          required={field.required}
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
        <>
          <label className="mobile_input_label">
            {field.name}
            {field.required && <span className="required"> *(Required)</span>}
          </label>
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
                          extraFields: {
                            ...state.extraFields,
                            [field.name]: "",
                          },
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
        </>
      )}
    </div>
  );
}

export default FieldMap;
