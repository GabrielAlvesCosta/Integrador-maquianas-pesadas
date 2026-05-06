document.addEventListener('DOMContentLoaded', () => {

    const loginModalEl = document.getElementById('loginModal');
    const cadastroModalEl = document.getElementById('cadastroModal');
    const sucessoModalEl = document.getElementById('sucessoModal');
    const loginModal = new bootstrap.Modal(loginModalEl);
    const cadastroModal = new bootstrap.Modal(cadastroModalEl);
    const sucessoModal = new bootstrap.Modal(sucessoModalEl);

    const logoutBtn = document.getElementById('logoutBtn');
    const mainActionBtn = document.getElementById('mainActionBtn');
    const mostrarCriarLink = document.querySelector('#loginModal #mostrarCriarLink');
    const mostrarEntrarLink = document.querySelector('#cadastroModal #mostrarEntrarLink');


    const nomeInput = document.getElementById('name');
    const cpfInput = document.getElementById('cpf');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const enderecoInput = document.getElementById('endereco');
    const senhaInput = document.getElementById('password');
    const confirmaSenhaInput = document.getElementById('confirm-password');
    const fotoInput = document.getElementById('foto');
    const previewFoto = document.getElementById('previewFoto');
    const criarBotao = document.getElementById('butaocriar');
    const mensagemCriar = document.getElementById('mensagemCriar');
    let fotoBase64 = null;
gin
    const entrarCpfInput = document.getElementById('entrarcpf');
    const entrarSenhaInput = document.getElementById('entrarsenha');
    const entrarBotao = document.getElementById('butaoentrar');
    const mensagemEntrar = document.getElementById('mensagemEntrar');

    function validaNomeCompleto(nome) {
        const nomeTrimmed = nome.trim();
        if (!nomeTrimmed.includes(' ')) return false;
        const palavras = nomeTrimmed.split(' ');
        for (const palavra of palavras) {
            if (palavra.length > 0 && !/^[A-ZÀ-ÖØ-Þ]/.test(palavra)) {
                return false;
            }
        }
        return true;
    }

    function validaCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        return true;
    }

    function validaEndereco(endereco) {
        const enderecoTrimmed = endereco.trim();
        if (!/\d/.test(enderecoTrimmed)) return false;
        const partes = enderecoTrimmed.split(' ');
        let contadorDePalavras = 0;
        for (const parte of partes) {
            if (parte.length > 0 && isNaN(parte)) {
                if (!/^[A-ZÀ-ÖØ-Þ]/.test(parte)) return false;
                contadorDePalavras++;
            }
        }
        return contadorDePalavras >= 2;
    }

    function validaEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    function validaSenha(senha) {
        if (senha.length < 8) return false;
        if (!/[a-z]/.test(senha)) return false;
        if (!/[A-Z]/.test(senha)) return false;
        if (!/[0-9]/.test(senha)) return false;
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) return false;
        return true;
    }

    function updateHeaderUI(isLoggedIn) {
        if (isLoggedIn) {
            logoutBtn.textContent = 'Sair';
            logoutBtn.style.display = 'inline-block';
            mainActionBtn.textContent = 'Minha Conta';
        } else {
            logoutBtn.style.display = 'none';
            mainActionBtn.textContent = 'Entrar / Cadastrar';
        }
    }

    function mostrarDadosSucesso(cpf) {
        const userDataString = localStorage.getItem(cpf);
        if (!userDataString) return;
        const userData = JSON.parse(userDataString);
        
        document.getElementById('nomecolocado').textContent = userData.nome;
        document.getElementById('cpfcolocado').textContent = userData.cpf;
        document.getElementById('emailcolocado').textContent = userData.email;
        document.getElementById('telefonecolocado').textContent = userData.telefone;
        document.getElementById('enderecocolocado').textContent = userData.endereco;

        const fotoColocada = document.getElementById('fotoColocada');
        if (userData.fotoBase64) {
            fotoColocada.src = userData.fotoBase64;
            fotoColocada.style.display = 'block';
        } else {
            fotoColocada.style.display = 'none';
        }
        sucessoModal.show();
    }

    function logout() {
        localStorage.removeItem('loggedInUserCPF');
        updateHeaderUI(false);
        sucessoModal.hide();
    }

    mainActionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const loggedInUserCPF = localStorage.getItem('loggedInUserCPF');
        if (loggedInUserCPF) {
            mostrarDadosSucesso(loggedInUserCPF);
        } else {
            loginModal.show();
        }
    });

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    mostrarCriarLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.hide();
        cadastroModal.show();
    });

    mostrarEntrarLink.addEventListener('click', (e) => {
        e.preventDefault();
        cadastroModal.hide();
        loginModal.show();
    });

    loginModalEl.addEventListener('hidden.bs.modal', () => {
        document.getElementById('loginForm').reset();
        mensagemEntrar.textContent = '';
    });
    cadastroModalEl.addEventListener('hidden.bs.modal', () => {
        document.getElementById('cadastroForm').reset();
        mensagemCriar.innerHTML = '';
        previewFoto.style.display = 'none';
        fotoBase64 = null;
    });

    entrarBotao.addEventListener('click', () => {
        mensagemEntrar.innerHTML = '';
        const cpf = entrarCpfInput.value.trim();
        const senha = entrarSenhaInput.value.trim();
        const erros = [];

        if (cpf === '') { erros.push('O campo CPF é obrigatório.'); }
        if (senha === '') { erros.push('O campo Senha é obrigatório.'); }

        if (erros.length > 0) {
            mensagemEntrar.innerHTML = erros.join('<br>');
            return;
        }

        const cpfApenasNumeros = cpf.replace(/\D/g, '');
        const cpfGuardadoString = localStorage.getItem(cpfApenasNumeros);

        if (cpfGuardadoString) {
            const dadosGuardadosCpf = JSON.parse(cpfGuardadoString);
            if (dadosGuardadosCpf.senha === senha) {
                localStorage.setItem('loggedInUserCPF', cpfApenasNumeros);
                updateHeaderUI(true);
                loginModal.hide();
                mostrarDadosSucesso(cpfApenasNumeros);
            } else {
                mensagemEntrar.textContent = 'Usuário ou senha inválido.';
            }
        } else {
            mensagemEntrar.textContent = 'Usuário ou senha inválido.';
        }
    });

    criarBotao.addEventListener('click', () => {
        mensagemCriar.innerHTML = '';
        const erros = [];

        const nome = nomeInput.value.trim();
        const cpf = cpfInput.value.trim();
        const email = emailInput.value.trim();
        const telefone = telefoneInput.value.trim();
        const endereco = enderecoInput.value.trim();
        const senha = senhaInput.value.trim();
        const confirmaSenha = confirmaSenhaInput.value.trim();

        if (nome === '' || cpf === '' || email === '' || telefone === '' || endereco === '' || senha === '' || confirmaSenha === '') {
            erros.push('Todos os campos, exceto foto, são obrigatórios.');
        } else {
            if (!validaNomeCompleto(nome)) erros.push('Nome completo inválido (Ex: João Silva).');
            const cpfApenasNumeros = cpf.replace(/\D/g, '');
            if (!validaCPF(cpf)) {
                erros.push('CPF inválido (formato ou cálculo).');
            } else if (localStorage.getItem(cpfApenasNumeros)) {
                erros.push('Este CPF já está cadastrado.');
            }
            if (!validaEndereco(endereco)) erros.push('Endereço inválido (Ex: Rua Nome, 123).');
            const digitosTelefone = telefone.replace(/\D/g, '');
            if (digitosTelefone.length !== 11) erros.push('Telefone deve ter 11 dígitos.');
            if (!validaEmail(email)) erros.push('Formato de e-mail inválido.');
            if (!validaSenha(senha)) erros.push('Senha fraca (mínimo 8 caracteres, maiúscula, minúscula, número e símbolo).');
            if (senha !== confirmaSenha) erros.push('As senhas não coincidem.');
        }

        if (erros.length > 0) {
            mensagemCriar.innerHTML = erros.join('<br>');
            return;
        }

        const cpfApenasNumeros = cpf.replace(/\D/g, '');
        const userData = { nome, cpf: cpfApenasNumeros, email, telefone, endereco, senha, fotoBase64 };
        localStorage.setItem(cpfApenasNumeros, JSON.stringify(userData));
        
        alert('Cadastro realizado com sucesso! Por favor, faça o login.');
        cadastroModal.hide();
        loginModal.show();
    });

    fotoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 1 * 1024 * 1024) { // Limite de 1MB
                alert("Erro: A imagem é muito grande! (Máximo 1MB)");
                fotoInput.value = '';
                previewFoto.style.display = 'none';
                fotoBase64 = null;
                return;
            }
            const reader = new FileReader();
            reader.onload = function(loadEvent) {
                fotoBase64 = loadEvent.target.result;
                previewFoto.src = fotoBase64;
                previewFoto.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            fotoInput.value = '';
            previewFoto.style.display = 'none';
            fotoBase64 = null;
            if (file) {
                 alert("Por favor, selecione um arquivo de imagem válido.");
            }
        }
    });

    cpfInput.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '').substring(0, 11);
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        valor = valor.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        e.target.value = valor;
    });
    
    telefoneInput.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '').substring(0, 11);
        let valorFormatado = '';
        if (valor.length > 0) valorFormatado = '(' + valor.substring(0, 2);
        if (valor.length > 2) valorFormatado += ') ' + valor.substring(2, 7);
        if (valor.length > 7) valorFormatado += '-' + valor.substring(7, 11);
        e.target.value = valorFormatado;
    });

    updateHeaderUI(localStorage.getItem('loggedInUserCPF'));
});

