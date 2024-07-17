// Function to calculate mortgage details
function calculateMortgage() {
    // Clear previous results
    clearResults();

    // Hide amortization table if it's open
    hideAmortizationTable();

    // Get input values
    const homePrice = getInputFloatValue('homePrice');
    const downPaymentPercent = getInputFloatValue('downPayment');
    const loanTerm = getInputIntValue('loanTerm');
    const interestRate = getInputFloatValue('interestRate');

    // ***Validate inputs
    if (isNaN(homePrice) || isNaN(downPaymentPercent) || isNaN(loanTerm) || isNaN(interestRate)) {
        alert('Please enter valid numeric inputs.');
        return;
    }

    // Validate percentages
    if (downPaymentPercent > 100 || interestRate > 100) {
        alert("Downpayment and Interest Rate should not exceed 100%");
        return;
    }

    // Convert percentages to decimal
    const downPaymentDecimal = downPaymentPercent / 100;
    const interestRateDecimal = interestRate / 100;

    // Calculate mortgage details
    const downPayment = homePrice * downPaymentDecimal;
    const loanAmount = homePrice - downPayment;
    const numberOfMonths = loanTerm * 12;
    const monthlyInterestRate = interestRateDecimal / 12;

    const mortgagePayment = calculateMonthlyPayment(loanAmount, monthlyInterestRate, numberOfMonths);
    const MortgageAmount = mortgagePayment * numberOfMonths;
    const interestAmount = MortgageAmount - loanAmount;

    // Display results
    displayResults({
        homeCost: homePrice,
        downPaymentAmt: downPayment,
        loanAmount: loanAmount,
        monthlyPayment: mortgagePayment,
        MortgageAmount: MortgageAmount,
        interestAmount: interestAmount
    });

    // Show results and scroll to them
    const resultsElement = document.getElementById('results');
    resultsElement.style.display = 'block';
    resultsElement.scrollIntoView({ behavior: 'smooth' });
}

// Function to calculate monthly mortgage payment
function calculateMonthlyPayment(loanAmount, monthlyInterestRate, numberOfMonths) {
    return (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths));
}

// Function to generate amortization table
function generateAmortizationTable() {
    // Ensure mortgage calculation is done before generating amortization
    const monthlyPaymentText = document.getElementById('monthlyPayment').textContent.trim();
    if (monthlyPaymentText === 'NaN') {
        alert('Please calculate the mortgage first.');
        return;
    }

    // Get input values
    const homePrice = getInputFloatValue('homePrice');
    const downPaymentPercent = getInputFloatValue('downPayment');
    const loanTerm = getInputIntValue('loanTerm');
    const interestRate = getInputFloatValue('interestRate');

    // Convert percentages to decimal
    const downPaymentDecimal = downPaymentPercent / 100;
    const interestRateDecimal = interestRate / 100;

    // Calculate mortgage details
    const loanAmount = homePrice * (1 - downPaymentDecimal);
    const numberOfMonths = loanTerm * 12;
    const monthlyInterestRate = interestRateDecimal / 12;
    const monthlyPayment = calculateMonthlyPayment(loanAmount, monthlyInterestRate, numberOfMonths);

    // Generate and display amortization schedule
    generateAmortizationSchedule(loanAmount, monthlyInterestRate, numberOfMonths, monthlyPayment);

    // Show the amortization table and scroll to it
    showAmortizationTable();
}

// Function to generate amortization schedule rows
function generateAmortizationSchedule(loanAmount, monthlyInterestRate, numberOfMonths, monthlyPayment) {
    const tableBody = document.querySelector('#amortizationTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    let balance = loanAmount;
    for (let month = 1; month <= numberOfMonths; month++) {
        const interest = balance * monthlyInterestRate;
        const principal = monthlyPayment - interest;
        balance -= principal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${month}</td>
            <td>${formatCurrency(monthlyPayment)}</td>
            <td>${formatCurrency(interest)}</td>
            <td>${formatCurrency(principal)}</td>
            <td>${formatCurrency(balance)}</td>
        `;
        tableBody.appendChild(row);
    }
}

// Helper function to clear previous results
function clearResults() {
    const resultFields = ['homeCost', 'downPaymentAmt', 'loanAmount', 'monthlyPayment', 'MortgageAmount', 'interestAmount'];
    resultFields.forEach(field => {
        document.getElementById(field).textContent = 'NaN';
    });
}

// Helper function to display results with thousands separators
function displayResults(results) {
    Object.keys(results).forEach(key => {
        const value = results[key];
        document.getElementById(key).textContent = formatCurrency(value);
    });
}

// Helper function to get float value from input
function getInputFloatValue(id) {
    return parseFloat(document.getElementById(id).value.replace(/,/g, ''));
}

// Helper function to get integer value from input
function getInputIntValue(id) {
    return parseInt(document.getElementById(id).value.replace(/,/g, ''));
}

// Helper function to format currency with thousands separator
function formatCurrency(amount) {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// Function to hide the amortization table
function hideAmortizationTable() {
    const amortizationTableElement = document.getElementById('amortizationTable');
    amortizationTableElement.style.display = 'none';
}

// Function to show the amortization table
function showAmortizationTable() {
    const amortizationTableElement = document.getElementById('amortizationTable');
    amortizationTableElement.style.display = 'block';
}

// Apply formatting to input fields
document.addEventListener('DOMContentLoaded', function () {
    formatInputFieldWithCommas(document.getElementById('homePrice'));
    formatInputFieldWithCommas(document.getElementById('downPayment'));
    formatInputFieldWithCommas(document.getElementById('loanTerm'));
    formatInputFieldWithCommas(document.getElementById('interestRate'));
});

// Helper function to format input fields with comma separators
function formatInputFieldWithCommas(inputElement) {
    inputElement.addEventListener('input', function () {
        const value = inputElement.value.replace(/,/g, '');
        if (!isNaN(value)) {
            inputElement.value = parseFloat(value).toLocaleString('en-US');
        }
    });
}