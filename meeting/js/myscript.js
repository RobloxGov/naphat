
    function formatInput(event) {
      let input = event.target.value;
      
      input = input.replace(/\D/g, "");

      let formattedInput = input.replace(/^(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})$/, "$1-$2-$3-$4-$5");

      event.target.value = formattedInput;
    }
