document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addBtn');
    const input = document.getElementById('taskInput');
    const list = document.getElementById('taskList');
    const dynamicLog = document.getElementById('dynamicLog');

    let tasks = JSON.parse(localStorage.getItem('taskflow_db')) || [];

    function render() {
        list.innerHTML = '';
        tasks.forEach((t, i) => {
            const item = document.createElement('div');
            item.className = 'task-item';
            item.innerHTML = `<span><i class="fas fa-check-circle" style="color: #8b5cf6"></i> ${t}</span> 
                              <button onclick="del(${i})" style="background:none; border:none; color:#ef4444; cursor:pointer">Remover</button>`;
            list.appendChild(item);
        });
        localStorage.setItem('taskflow_db', JSON.stringify(tasks));
    }

    addBtn.addEventListener('click', () => {
        if(input.value) {
            tasks.push(input.value);
            // Simula log de banco de dados
            dynamicLog.innerHTML = `<span>[${new Date().toLocaleTimeString()}]</span> INSERT INTO tasks (content) VALUES ('${input.value}');`;
            input.value = '';
            render();
        }
    });

    window.del = (i) => {
        tasks.splice(i, 1);
        render();
    };

    render();
});
document.addEventListener('DOMContentLoaded', () => {
    // Seletores de Navegação
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = {
        '#dashboard': document.getElementById('dashboard'),
        '#config': document.getElementById('config')
    };

    // 1. LÓGICA DE NAVEGAÇÃO SPA
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            if (sections[target]) {
                e.preventDefault();
                // Esconde todas as seções
                Object.values(sections).forEach(s => s.style.display = 'none');
                // Remove active de todos os links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Mostra a seção alvo e ativa o link
                sections[target].style.display = 'block';
                link.classList.add('active');
            }
        });
    });

    // 2. FUNCIONALIDADE DE CONFIGURAÇÕES
    const saveBtn = document.getElementById('saveSettings');
    const resetBtn = document.getElementById('resetDB');
    const nameInput = document.getElementById('userNameInput');
    const colorInput = document.getElementById('themeColorInput');
    const sidebarName = document.querySelector('.user-profile span');

    // Carregar preferências salvas
    const prefs = JSON.parse(localStorage.getItem('taskflow_prefs')) || { name: 'Marcelo Dev', color: '#8b5cf6' };
    
    function applyPrefs() {
        sidebarName.innerText = prefs.name;
        document.documentElement.style.setProperty('--primary', prefs.color);
        nameInput.value = prefs.name;
        colorInput.value = prefs.color;
    }
    applyPrefs();

    // Salvar Alterações
    saveBtn.addEventListener('click', () => {
        prefs.name = nameInput.value;
        prefs.color = colorInput.value;
        localStorage.setItem('taskflow_prefs', JSON.stringify(prefs));
        applyPrefs();
        alert('Configurações atualizadas com sucesso no Sistema!');
    });

    // Resetar Banco (Limpa Tarefas)
    resetBtn.addEventListener('click', () => {
        if(confirm('Deseja realmente limpar todos os dados do PostgreSQL simulado?')) {
            localStorage.removeItem('taskflow_db');
            location.reload(); // Recarrega para limpar a tela
        }
    });
});