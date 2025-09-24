const tableBody = document.getElementById('tableBody');
const errorBox = document.getElementById('error');
const updatedAtEl = document.getElementById('updatedAt');
const refreshBtn = document.getElementById('refreshBtn');

async function fetchTimes() {
    errorBox.hidden = true;
    errorBox.textContent = '';
    tableBody.innerHTML = '<tr><td colspan="4">Загрузка...</td></tr>';
    try {
        const res = await fetch('time.php', { cache: 'no-store' });
        if (!res.ok) throw new Error('Сервер вернул ошибку ' + res.status);
        const data = await res.json();
        renderRows(data.items);
        const now = new Date();
        updatedAtEl.textContent = `Обновлено: ${now.toLocaleString('ru-RU')}`;
    } catch (e) {
        tableBody.innerHTML = '';
        errorBox.textContent = 'Не удалось загрузить данные: ' + e.message;
        errorBox.hidden = false;
    }
}

function renderRows(items) {
    const isMobile = window.matchMedia('(max-width: 720px)').matches;
    tableBody.innerHTML = items.map(row => {
        const tz = row.timezone;
        const time = new Date(row.iso).toLocaleString('ru-RU', { timeZone: tz, hour12: false });
        const tzShort = tz.replace('Europe/', '').replace('Asia/', '').replace('Arctic/', '').replace('Antarctica/', '').replace('Etc/', '');
        if (isMobile) {
            return `
            <tr>
                <td data-label="Субъект РФ">${row.region}</td>
                <td data-label="Областной центр">${row.city}</td>
                <td data-label="Часовой пояс">${tz} (${row.offset})</td>
                <td data-label="Текущее время">${time}</td>
            </tr>`;
        }
        return `
        <tr>
            <td>${row.region}</td>
            <td>${row.city}</td>
            <td title="${tz}">${tzShort} (${row.offset})</td>
            <td>${time}</td>
        </tr>`;
    }).join('');
}

refreshBtn.addEventListener('click', fetchTimes);

fetchTimes();


