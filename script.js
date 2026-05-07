document.addEventListener('DOMContentLoaded', () => {
    const telaCriar = document.getElementById('telacriar');
    const telaEntrar = document.getElementById('telaentrar');
    const telaSucesso = document.getElementById('telasucesso');
    const mostarCriarLink = document.getElementById('mostarcriar');
    const mostrarEntrarLink = document.getElementById('mostrarentrar');
    const nomeInput = document.getElementById('name');
    const cpfInput = document.getElementById('cpf');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');    
    const enderecoInput = document.getElementById('endereco');
    const senhaInput = document.getElementById('password');
    const confirmaSenhaInput = document.getElementById('confirm-password')
    const entrarCpfInput = document.getElementById('entrarcpf');
    const entrarSenhaInput = document.getElementById('entrarsenha');
    const criarBotao = document.getElementById('butaocriar');
    const entrarBotao = document.getElementById('butaoentrar');
    const entrarBtnHeader = document.querySelector('.header-actions .login-btn');
    const anunciarBtnHeader = document.querySelector('.header-actions .btn-primary')
    const mensagemCriar = document.getElementById('mensagemcriar');
    const mensagemEntrar = document.getElementById('mensagementrar');

    function validaSenha(senha) {
        if (senha.length < 8) return false;
        if (!/[a-z]/.test(senha)) return false;
        if (!/[A-Z]/.test(senha)) return false;
        if (!/[0-9]/.test(senha)) return false;
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) return false;
        return true;
    }
    function validaEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }
    function validaCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11) return false;
        if (/^(\d)\1+$/.test(cpf)) return false;
        let soma = 0;
        let resto;
        for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if ((resto == 10) || (resto == 11)) resto = 0;
        if (resto != parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if ((resto == 10) || (resto == 11)) resto = 0;
        if (resto != parseInt(cpf.substring(10, 11))) return false;
        return true;
        }
    function validaNomeCompleto(nome) {
        const nomeTrimmed = nome.trim();
        if (!nomeTrimmed.includes(' ')) {
        return false;
        }
        const palavras = nomeTrimmed.split(' ');
        for (const palavra of palavras) {
        if (palavra.length === 0) {
        continue;
        }
        if (!/^[A-ZÀ-ÖØ-Þ]/.test(palavra)) {
            return false;
        }
        }
        return true;
    }
    function validaEndereco(endereco) {
        const enderecoTrimmed = endereco.trim();
        if (!/\d/.test(enderecoTrimmed)) {
        return false;
        }
        const partes = enderecoTrimmed.split(' ');
        let contadorDePalavras = 0;
        for (const parte of partes) {
        if (parte.length === 0) {
            continue;
        }
        if (isNaN(parte)) {
        if (!/^[A-ZÀ-ÖØ-Þ]/.test(parte)) {
        return false;
        }
        contadorDePalavras++;
        }
        }
        if (contadorDePalavras < 2) {
        return false;
        }
        return true;
    }

    function limparFormularioLogin() {
    entrarCpfInput.value = '';
    entrarSenhaInput.value = '';
    mensagemEntrar.textContent = '';
    }

    function mostrarTelaSucesso(cpf) {
        const usuarioGuardadoString = localStorage.getItem(cpf);
        if (!usuarioGuardadoString) return;
        const dadosUsuario = JSON.parse(usuarioGuardadoString);
        const cpfColocado = document.getElementById('cpfcolocado');
        const senhaColocado = document.getElementById('senhacolocado');
        const nomeColocado = document.getElementById('nomecolocado');
        const emailColocado = document.getElementById('emailcolocado');
        const telefoneColocado = document.getElementById('telefonecolocado');
        const enderecoColocado = document.getElementById('enderecocolocado');
        cpfColocado.textContent = dadosUsuario.cpf;
        senhaColocado.textContent = dadosUsuario.senha;
        nomeColocado.textContent = dadosUsuario.nome;
        emailColocado.textContent = dadosUsuario.email;
        telefoneColocado.textContent = dadosUsuario.telefone;
        enderecoColocado.textContent = dadosUsuario.endereco;
        telaCriar.style.display = 'none';
        telaEntrar.style.display = 'none';
        telaSucesso.style.display = 'block';
        entrarBtnHeader.textContent = 'Sair';
        entrarBtnHeader.style.display = '';
        anunciarBtnHeader.textContent = 'Sucesso';
    }
    
    function logout() {
        localStorage.removeItem('loggedInUserCPF');
        entrarBtnHeader.textContent = 'Entrar';
        entrarBtnHeader.style.display = 'none';
        anunciarBtnHeader.textContent = 'Entrar';
        telaEntrar.style.display = 'none';
        telaSucesso.style.display = 'none';
        telaCriar.style.display = 'block';
        limparFormularioLogin();
    }
    function verificarEstadoLogin() {
        const loggedInUserCPF = localStorage.getItem('loggedInUserCPF');
        if (loggedInUserCPF) {
            entrarBtnHeader.textContent = 'Sair';
            entrarBtnHeader.style.display = '';
            anunciarBtnHeader.textContent = 'Sucesso';
        } else {
            entrarBtnHeader.textContent = 'Entrar';
            entrarBtnHeader.style.display = 'none';
            anunciarBtnHeader.textContent = 'Entrar';
        }
    }

    telefoneInput.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        valor = valor.substring(0, 11);
        let valorFormatado = '';
        if (valor.length > 0) {
        valorFormatado = '(' + valor.substring(0, 2);
        }
        if (valor.length > 2) {
        valorFormatado += ') ' + valor.substring(2, 7);
        }
        if (valor.length > 7) {
        valorFormatado += '-' + valor.substring(7, 11);
        }
        e.target.value = valorFormatado;
    });

    mostrarEntrarLink.addEventListener('click', (e) => {
        e.preventDefault();
        telaCriar.style.display = 'none';
        telaSucesso.style.display = 'none';
        telaEntrar.style.display = 'block';
    });
    mostarCriarLink.addEventListener('click', (e) => {
        e.preventDefault();
        telaEntrar.style.display = 'none';
        telaSucesso.style.display = 'none';
        telaCriar.style.display = 'block';
        limparFormularioLogin();
    });

    entrarBtnHeader.addEventListener('click', (e) => {
        e.preventDefault();
        if (entrarBtnHeader.textContent === 'Entrar') {
            telaCriar.style.display = 'none';
            telaSucesso.style.display = 'none';
            telaEntrar.style.display = 'block';
            limparFormularioLogin();
        } else {
            logout();
        }
    });

    anunciarBtnHeader.addEventListener('click', (e) => {
        e.preventDefault();
        const loggedInUserCPF = localStorage.getItem('loggedInUserCPF');
        if (loggedInUserCPF) {
            mostrarTelaSucesso(loggedInUserCPF);
        } else {
            telaCriar.style.display = 'none';
            telaSucesso.style.display = 'none';
            telaEntrar.style.display = 'block';
            limparFormularioLogin();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (telaCriar.style.display !== 'none') {
                e.preventDefault();
                criarBotao.click();
            } else if (telaEntrar.style.display !== 'none') {
                e.preventDefault();
                entrarBotao.click();
            }
        }
    });

        criarBotao.addEventListener('click', (e) => {
        e.preventDefault();
        mensagemCriar.innerHTML = '';
        const erros = [];
        const nome = nomeInput.value.trim();
        const cpf = cpfInput.value.trim();
        const email = emailInput.value.trim();
        const telefone = telefoneInput.value.trim();
        const endereco = enderecoInput.value.trim();
        const senha = senhaInput.value.trim();
        const confirmaSenha = confirmaSenhaInput.value.trim();
        if (nome === '') {
            erros.push('O campo Nome Completo é obrigatório.');
        } else if (!validaNomeCompleto(nome)) {
            erros.push('Nome completo inválido (Ex: João Silva).');
        }
        const cpfApenasNumeros = cpf.replace(/\D/g, '');
        if (cpf === '') {
            erros.push('O campo CPF é obrigatório.');
        } else if (!validaCPF(cpf)) {
            erros.push('CPF inválido (formato ou cálculo).');
        } else if (localStorage.getItem(cpfApenasNumeros)) {
            erros.push('Este CPF já está cadastrado.');
        }
        if (endereco === '') {
            erros.push('O campo Endereço é obrigatório.');
        } else if (!validaEndereco(endereco)) {
            erros.push('Endereço inválido (Ex: Rua Nome, 123).');
        }
        const digitosTelefone = telefone.replace(/\D/g, '');
        if (telefone === '') {
            erros.push('O campo Telefone é obrigatório.');
        } else if (digitosTelefone.length !== 11) {
            erros.push('Telefone deve ter 11 dígitos (DDD + número).');
        }
        if (email === '') {
            erros.push('O campo E-mail é obrigatório.');
        } else if (!validaEmail(email)) {
            erros.push('Formato de e-mail inválido.');
        }
        if (senha === '') {
            erros.push('O campo Senha é obrigatório.');
        } else if (!validaSenha(senha)) {
            erros.push('Senha fraca (mínimo 8 caracteres, maiúscula, minúscula, número e símbolo).');
        }
        if (confirmaSenha === '') {
            erros.push('O campo Confirmar Senha é obrigatório.');
        } else if (senha !== '' && senha !== confirmaSenha) {
            erros.push('As senhas não coincidem.');
        }
            if (erros.length > 0) {
                mensagemCriar.innerHTML = erros.join('<br>');
                mensagemCriar.style.color = 'red';
                return;
            }
            const userData = {
            nome,
            cpf: cpfApenasNumeros,
            email,
            telefone,
            endereco,
            senha
            };
            localStorage.setItem(cpfApenasNumeros, JSON.stringify(userData));
            mensagemCriar.textContent = 'Conta Criada com sucesso! Redirecionando para entrar...';
            mensagemCriar.style.color = 'green';
            setTimeout(() => {
            telaCriar.style.display = 'none';
            telaEntrar.style.display = 'block';
            [nomeInput, cpfInput, emailInput, telefoneInput, enderecoInput, senhaInput, confirmaSenhaInput].forEach(input => input.value = '');
            mensagemCriar.textContent = '';
            }, 2000);
        });

entrarBotao.addEventListener('click', (e) => {
    e.preventDefault();
    mensagemEntrar.innerHTML = '';
    const cpf = entrarCpfInput.value.trim();
    const senha = entrarSenhaInput.value.trim();
    const erros = [];
    if (cpf === '') {
        erros.push('O campo CPF é obrigatório.');
    }
    if (senha === '') {
        erros.push('O campo Senha é obrigatório.');
    }
    if (erros.length > 0) {
        mensagemEntrar.innerHTML = erros.join('<br>');
        mensagemEntrar.style.color = 'red';
        return;
    }
    const cpfApenasNumeros = cpf.replace(/\D/g, '');
    const cpfGuardadoString = localStorage.getItem(cpfApenasNumeros);
    if (cpfGuardadoString) {
        const dadosGuardadosCpf = JSON.parse(cpfGuardadoString);
        if (dadosGuardadosCpf.senha === senha) {
            localStorage.setItem('loggedInUserCPF', cpfApenasNumeros);
                mostrarTelaSucesso(cpfApenasNumeros); 
                limparFormularioLogin();
        } else {
            mensagemEntrar.textContent = 'Usuário ou senha inválido.';
            mensagemEntrar.style.color = 'red';
        }
    } else {
        mensagemEntrar.textContent = 'Usuário ou senha inválido.';
        mensagemEntrar.style.color = 'red';
    }
    });
    verificarEstadoLogin();
});