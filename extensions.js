export const DateExtension = {
  name: 'Date',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_date' || trace.payload?.name === 'ext_date',
  render: ({ trace, element }) => {
    // Function to create a new date picker
    const createDatePicker = () => {
      console.log("Generating new date picker...");

      // Step 1: Clear the existing form before rendering a new one
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }

      // Step 2: Generate a unique form ID to avoid caching issues
      const uniqueFormId = `date-form-${Date.now()}`;
      const formContainer = document.createElement('form');
      formContainer.id = uniqueFormId;

      let currentDate = new Date();
      let minDate = new Date();
      minDate.setDate(currentDate.getDate() + 14);
      let maxDate = new Date();
      maxDate.setFullYear(currentDate.getFullYear() + 1);

      let minDateString = minDate.toISOString().slice(0, 10);
      let maxDateString = maxDate.toISOString().slice(0, 10);

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
            <div class="meeting"><input type="date" id="start-date" name="start-date" min="${minDateString}" max="${maxDateString}" /></div><br>
            <label for="end-date">To Date</label><br>
            <div class="meeting"><input type="date" id="end-date" name="end-date" min="${minDateString}" max="${maxDateString}" /></div><br>
            <input type="submit" id="submit" class="submit" value="Continue" disabled="disabled">
            `;

      const submitButton = formContainer.querySelector('#submit');
      const startDateInput = formContainer.querySelector('#start-date');
      const endDateInput = formContainer.querySelector('#end-date');

      startDateInput.value = "";
      endDateInput.value = "";

      // Enable the submit button only when both dates are selected
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

      // Step 3: Handle form submission
      formContainer.addEventListener('submit', function (event) {
        event.preventDefault();

        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        console.log("Submitting date:", { startDate, endDate });

        // Send data to Voiceflow
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: { startDate: startDate, endDate: endDate },
        });

        // Step 4: Remove the old form and generate a new one
        setTimeout(() => {
          console.log("Refreshing date picker after submission...");
          createDatePicker();
        }, 500);
      });

      // Step 5: Append the new form
      element.appendChild(formContainer);
    };

    // Initial form creation
    createDatePicker();
  },
};
