import './Checkbox.css';

export default function Checkbox(props) {
    return (
      <div class="checkbox-wrapper-33">
      <label class="checkbox">
        <input class="checkbox__trigger visuallyhidden" type="checkbox" />
        <span class="checkbox__symbol">
          <svg aria-hidden="true" class="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 14l8 7L24 7"></path>
          </svg>
        </span>
        <p class="checkbox__textwrapper">{props.value}</p>
      </label>
    </div>
    );
}
