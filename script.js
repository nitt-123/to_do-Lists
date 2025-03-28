 // Load data and generate the table
        function loadSchedule() {
            const tbody = document.getElementById('schedule-body');
            tbody.innerHTML = '';
            scheduleData.forEach((item, index) => {
                const status = localStorage.getItem(`status_${index}`) || 'Pending';
                const rowClass = status === 'Completed' ? 'completed' : '';
                tbody.innerHTML += `
                    <tr class="${rowClass}">
                        <td>${item.week}</td>
                        <td>${item.date}</td>
                        <td>${item.topic}</td>
                        <td>
                            <select id="status_${index}" onchange="updateProgress()">
                                <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In Progress" ${status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Completed" ${status === 'Completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </td>
                    </tr>
                `;
            });
            updateProgress();
        }

        // Save progress to local storage
        function saveProgress() {
            scheduleData.forEach((item, index) => {
                const status = document.getElementById(`status_${index}`).value;
                localStorage.setItem(`status_${index}`, status);
            });
            alert('Progress saved successfully!');
        }

        // Reset progress
        function resetProgress() {
            if (confirm('Are you sure you want to reset all progress?')) {
                scheduleData.forEach((item, index) => {
                    localStorage.removeItem(`status_${index}`);
                });
                loadSchedule();
                alert('Progress has been reset.');
            }
        }

        // Update progress percentage
        function updateProgress() {
            let completedCount = 0;
            scheduleData.forEach((item, index) => {
                const status = document.getElementById(`status_${index}`).value;
                if (status === 'Completed') {
                    completedCount++;
                    document.querySelector(`#status_${index}`).closest('tr').classList.add('completed');
                } else {
                    document.querySelector(`#status_${index}`).closest('tr').classList.remove('completed');
                }
            });
            const percentage = ((completedCount / scheduleData.length) * 100).toFixed(2);
            document.getElementById('completion-percentage').innerText = `Completion: ${percentage}%`;
        }

        // Download progress as Excel
        function downloadExcel() {
            const data = scheduleData.map((item, index) => {
                return {
                    Week: item.week,
                    Date: item.date,
                    Topic: item.topic,
                    Status: document.getElementById(`status_${index}`).value
                };
            });

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "DSA Progress");

            XLSX.writeFile(workbook, "dsa_schedule_progress.xlsx");
        }

        // Toggle Dark Mode (Hacker Theme)
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
        }

        // Load schedule on page load
        window.onload = loadSchedule;
