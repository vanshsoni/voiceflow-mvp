export const DateExtension = {
  name: 'Date',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_date' || trace.payload?.name === 'ext_date',
  render: ({ trace, element }) => {
    // Step 1: Clear any existing date picker form before re-rendering
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    const formContainer = document.createElement('form');

    // Step 2: Get the date range (14 days from today to 1 year ahead)
    let currentDate = new Date();
    let minDate = new Date();
    minDate.setDate(currentDate.getDate() + 14);
    let maxDate = new Date();
    maxDate.setFullYear(currentDate.getFullYear() + 1);

    let minDateString = minDate.toISOString().slice(0, 10);
    let maxDateString = maxDate.toISOString().slice(0, 10);

    // Step 3: Create a fresh date picker form
    formContainer.innerHTML = `
          <style>
            label { font-size: 0.8em; color: #888; }
            input[type="date"]::-webkit-calendar-picker-indicator {
                border: none;
                background: transparent;
                border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
                cursor: pointer;
                padding:6px;
            }
            .meeting input {
              background: transparent;
              border: none;
              padding: 2px;
              border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
              font: normal 14px sans-serif;
              outline:none;
              margin: 5px 0;
            }
            .invalid { border-color: red; }
            .submit {
              background: linear-gradient(to right, #2e6ee1, #2e7ff1);
              border: none;
              color: white;
              padding: 10px;
              border-radius: 5px;
              width: 100%;
              cursor: pointer;
              opacity: 0.3;
            }
            .submit:enabled { opacity: 1; }
          </style>
          <div><p>⁠Kindly select the time you would like to request a holiday for. (Please note requests must be done min. 14 days in advance)</p></div><br>
          <label for="start-date">From Date</label><br>
          <div class="meeting"><input type="date" id="start-date" name="start-date" value="" min="${minDateString}" max="${maxDateString}" /></div><br>
          <label for="end-date">To Date</label><br>
          <div class="meeting"><input type="date" id="end-date" name="end-date" value="" min="${minDateString}" max="${maxDateString}" /></div><br>
          <input type="submit" id="submit" class="submit" value="Continue" disabled="disabled">
          `;

    const submitButton = formContainer.querySelector('#submit');
    const startDateInput = formContainer.querySelector('#start-date');
    const endDateInput = formContainer.querySelector('#end-date');

    // Step 4: Reset input values to ensure fresh selections
    startDateInput.value = "";
    endDateInput.value = "";

    const validateInputs = () => {
      if (startDateInput.value && endDateInput.value) {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        submitButton.disabled = startDate <= endDate ? false : true;
      } else {
        submitButton.disabled = true;
      }
    };

    startDateInput.addEventListener('input', validateInputs);
    endDateInput.addEventListener('input', validateInputs);

    formContainer.addEventListener('submit', function (event) {
      event.preventDefault();

      const startDate = startDateInput.value;
      const endDate = endDateInput.value;

      console.log({ startDate, endDate });

      formContainer.querySelector('.submit').remove();

      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { startDate: startDate, endDate: endDate },
      });
    });

    // Step 5: Append the new form (fresh instance)
    element.appendChild(formContainer);
  },
};
