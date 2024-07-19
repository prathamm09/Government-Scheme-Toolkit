document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const formData = {
        age: parseInt(document.getElementById('age').value), // Convert to integer
        gender: document.getElementById('gender').value,
        category: document.getElementById('category').value,
        religion: document.getElementById('religion').value,
        maritalstatus: document.getElementById('maritalstatus').value,
        income: document.getElementById('income').value,
        state: document.getElementById('state').value
    };

    // Send form data to the server using AJAX
    fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response and display search results as a single table
            const searchResultsContainer = document.getElementById('search-results');
            searchResultsContainer.innerHTML = ''; // Clear previous results

            if (data.error) {
                searchResultsContainer.innerHTML = `<p>${data.error}</p>`;
            } else {
                // Create a table to display the search results
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                // Create table header row
                const headerRow = document.createElement('tr');
                const headers = ['Scheme Name', 'Scheme ID', 'Age', 'Gender', 'Category', 'Religion', 'Marital Status', 'Income', 'State']; // Table headers
                headers.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Create table body rows for each scheme
                data.schemes.forEach(scheme => {
                    const row = document.createElement('tr');
                    Object.values(scheme).forEach(value => {
                        const td = document.createElement('td');
                        td.textContent = value;
                        row.appendChild(td);
                    });
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);

                // Add CSS classes for styling
                table.classList.add('search-result-table');

                // Append the table to the container
                searchResultsContainer.appendChild(table);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('search-results').innerHTML = '<p>An error occurred while processing your request.</p>';
        });
});
