// ==========================================
// LÓGICA DE MENSAGENS (MANTIDA)
// ==========================================
let contatoAtual = ''; 

const conversasDb = {
    'Carlos Lisboa (Operador)': [
        { tipo: 'recebida', texto: 'Olá João, o caminhão ainda está disponível para amanhã?', tempo: 'Hoje, 09:00' }
    ],
    'Maria Construtora': [
        { tipo: 'recebida', texto: 'Gostaria de fechar o guindaste para o fim de semana.', tempo: 'Ontem, 15:30' }
    ]
};

// O parâmetro 'elementoClicado' foi adicionado para podermos achar o badge
function abrirChat(elementoClicado, nomeDoContato) {
    contatoAtual = nomeDoContato;

    // Remove a notificação (badge) da tela assim que clicar na conversa
    if (elementoClicado) {
        const badgeNotificacao = elementoClicado.querySelector('.unread-badge');
        if (badgeNotificacao) {
            badgeNotificacao.classList.add('d-none'); // Oculta o número
        }
    }

    document.getElementById('listaMensagens').classList.add('d-none');
    document.getElementById('areaChat').classList.remove('d-none');
    document.getElementById('nomeContatoChat').innerText = nomeDoContato;
    document.getElementById('inputChat').value = '';

    const historico = document.getElementById('historicoChat');
    historico.innerHTML = ''; 

    if (!conversasDb[nomeDoContato]) {
        conversasDb[nomeDoContato] = [];
    }

    conversasDb[nomeDoContato].forEach(msg => {
        let msgHTML = '';
        if (msg.tipo === 'recebida') {
            msgHTML = `
                <div class="d-flex mb-3">
                    <div class="msg-bubble msg-received shadow-sm">
                        <p class="mb-1">${msg.texto}</p>
                        <small class="text-muted" style="font-size: 0.7rem;">${msg.tempo}</small>
                    </div>
                </div>
            `;
        } else {
            msgHTML = `
                <div class="d-flex justify-content-end mb-3">
                    <div class="msg-bubble msg-sent shadow-sm">
                        <p class="mb-1">${msg.texto}</p>
                        <small class="text-white-50" style="font-size: 0.7rem;">${msg.tempo}</small>
                    </div>
                </div>
            `;
        }
        historico.insertAdjacentHTML('beforeend', msgHTML);
    });

    historico.scrollTop = historico.scrollHeight; 
}

function voltarParaLista() {
    document.getElementById('areaChat').classList.add('d-none');
    document.getElementById('listaMensagens').classList.remove('d-none');
    contatoAtual = ''; 
}

function enviarMensagemChat(event) {
    event.preventDefault(); 
    
    const input = document.getElementById('inputChat');
    const textoMensagem = input.value;
    
    if(textoMensagem.trim() === '') return; 

    conversasDb[contatoAtual].push({
        tipo: 'enviada',
        texto: textoMensagem,
        tempo: 'Agora'
    });

    const novaMensagemHTML = `
        <div class="d-flex justify-content-end mb-3">
            <div class="msg-bubble msg-sent shadow-sm">
                <p class="mb-1">${textoMensagem}</p>
                <small class="text-white-50" style="font-size: 0.7rem;">Agora</small>
            </div>
        </div>
    `;
    
    const historico = document.getElementById('historicoChat');
    historico.insertAdjacentHTML('beforeend', novaMensagemHTML);
    historico.scrollTop = historico.scrollHeight;
    input.value = '';
}

// ==========================================
// OUTRAS FUNÇÕES DO PAINEL & AUXILIARES
// ==========================================
function previewFoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('perfilFoto').src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function atualizarCategorias(targetId, tipo) {
    const select = document.getElementById(targetId);
    if (!select) return;

    const catsMaquina = ['Escavadeiras', 'Guindastes', 'Caminhões', 'Compactadores'];
    const catsOperador = ['Op. de Escavadeira', 'Op. de Guindaste', 'Motorista de Caminhão'];
    
    const lista = (tipo === 'maquina') ? catsMaquina : catsOperador;
    select.innerHTML = lista.map(c => `<option value="${c}">${c}</option>`).join('');
}

function obtenerClasseRelevancia(relevancia) {
    if (relevancia === 'Alta') return 'bg-info-subtle text-info';
    if (relevancia === 'Muito Alto') return 'bg-warning-subtle text-warning';
    if (relevancia === 'Premium') return 'bg-danger-subtle text-danger';
    if (relevancia === 'Principal') return 'bg-primary-subtle text-primary';
    if (relevancia === 'Principal Premium') return 'bg-dark text-white';
    return 'bg-secondary-subtle text-secondary'; 
}

// Retorna a cor correta baseada no status atual
function obtenerClasseStatus(status) {
    if (status === 'Em Uso') return 'bg-warning text-dark';
    return 'bg-success-subtle text-success'; // Padrão: Ativo
}

// ==========================================
// LÓGICA DE SERVIÇOS (COM EDIÇÃO DE STATUS)
// ==========================================
let linhaSendoEditada = null; 
let modalEdicaoInstancia = null; 

function excluirServico(botaoClicado) {
    if (confirm("Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.")) {
        botaoClicado.closest('tr').remove();
    }
}

function publicarServico(event) {
    event.preventDefault(); 

    const titulo = document.getElementById('novoTitulo').value;
    const precoRaw = document.getElementById('novoPreco').value;
    const preco = parseFloat(precoRaw).toFixed(2);
    const categoria = document.getElementById('catNovo').value;
    const tipo = document.getElementById('tipoServico').value;
    const relevancia = document.getElementById('relevanciaNovo').value; 
    
    const campoLoc = document.getElementById('novoLocalizacao');
    const campoDesc = document.getElementById('novoDescricao');
    const localizacao = campoLoc ? campoLoc.value : '';
    const descricao = campoDesc ? campoDesc.value : '';

    const subtitulo = tipo === 'maquina' ? `Máquinas > ${categoria}` : `Operador > ${categoria}`;
    const inputArquivo = document.getElementById('novoArquivo');
    
    let imgSrc = tipo === 'maquina' ? 'https://via.placeholder.com/70x50?text=Maq' : 'https://via.placeholder.com/70x50?text=Op';

    const criarLinhaTabela = (imagemParaUsar) => {
        let corBadgeRel = obtenerClasseRelevancia(relevancia);
        let corBadgeStatus = obtenerClasseStatus('Ativo'); 

        const novaLinhaHTML = `
            <tr data-titulo="${titulo}" data-preco="${preco}" data-tipo="${tipo}" data-categoria="${categoria}" data-relevancia="${relevancia}" data-status="Ativo" data-img="${imagemParaUsar}" data-localizacao="${localizacao}" data-descricao="${descricao}">
                
                <td style="width: 60%; max-width: 0;"> 
                    <div class="d-flex align-items-start w-100">
                        <img src="${imagemParaUsar}" class="service-img-mini img-servico me-3" style="width:70px; height:50px; object-fit:cover; border-radius: 4px;">
                        <div class="w-100">
                            <div class="fw-bold titulo-servico">${titulo}</div>
                            <small class="text-muted d-block subtitulo-servico">${subtitulo}</small>
                            <small class="text-muted d-block mt-1"><i class="bi bi-geo-alt-fill text-danger"></i> <span class="texto-localizacao">${localizacao || 'Não informada'}</span></small>
                            
                            <div class="mt-2 p-2 bg-light rounded text-secondary w-100" style="font-size: 0.85rem; max-height: 100px; overflow-y: auto; overflow-wrap: break-word; word-break: break-word;">
                                <strong>Descrição:</strong> <span class="texto-descricao">${descricao || 'Sem descrição.'}</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="align-middle">
                    <span class="badge ${corBadgeStatus} badge-status">Ativo</span>
                    <span class="badge ${corBadgeRel} badge-relevancia d-block mt-1" style="max-width: fit-content;">${relevancia}</span>
                </td>
                <td class="preco-servico fw-bold text-nowrap align-middle">R$ ${preco.replace('.', ',')}</td>
                <td class="text-end align-middle">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="abrirEdicao(this)"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="excluirServico(this)"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;

        document.getElementById('tabelaMeusServicos').insertAdjacentHTML('afterbegin', novaLinhaHTML);

        alert("Parabéns! Seu serviço foi publicado com sucesso.");
        document.getElementById('formNovoServico').reset();
        atualizarCategorias('catNovo', 'maquina');
        const tab = new bootstrap.Tab(document.querySelector('#tab-meus-servicos'));
        tab.show();
    };

    if (inputArquivo && inputArquivo.files && inputArquivo.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            criarLinhaTabela(e.target.result);
        }
        reader.readAsDataURL(inputArquivo.files[0]);
    } else {
        criarLinhaTabela(imgSrc);
    }
}

function abrirEdicao(botaoClicado) {
    linhaSendoEditada = botaoClicado.closest('tr');
    
    // Resgata os dados da linha (TR)
    const titulo = linhaSendoEditada.getAttribute('data-titulo') || '';
    const preco = linhaSendoEditada.getAttribute('data-preco') || '';
    const tipo = linhaSendoEditada.getAttribute('data-tipo') || 'maquina';
    const categoria = linhaSendoEditada.getAttribute('data-categoria') || '';
    const relevancia = linhaSendoEditada.getAttribute('data-relevancia') || 'Normal';
    const status = linhaSendoEditada.getAttribute('data-status') || 'Ativo';
    const img = linhaSendoEditada.getAttribute('data-img') || '';
    const localizacao = linhaSendoEditada.getAttribute('data-localizacao') || '';
    const descricao = linhaSendoEditada.getAttribute('data-descricao') || '';

    // Preenche os inputs do Modal
    document.getElementById('editTitulo').value = titulo;
    document.getElementById('editPreco').value = preco;
    document.getElementById('editRelevancia').value = relevancia;
    document.getElementById('editStatus').value = status;
    document.getElementById('editLocalizacao').value = localizacao;
    document.getElementById('editDescricao').value = descricao;

    // Campos bloqueados (apenas leitura)
    const tipoTexto = tipo === 'maquina' ? 'Máquina / Equipamento' : 'Prestação de Serviço (Operador)';
    document.getElementById('editTipo').value = tipoTexto;
    document.getElementById('editCategoria').value = categoria;

    if (document.getElementById('editPreviewFoto')) {
        document.getElementById('editPreviewFoto').src = img;
    }
    
    // Abre o modal manualmente para garantir compatibilidade
    const modalElement = document.getElementById('modalEditarServico');
    const instance = bootstrap.Modal.getOrCreateInstance(modalElement);
    instance.show();
}

function salvarEdicao() {
    if (!linhaSendoEditada) return;

    // 1. Captura os novos valores dos campos do modal
    const novoTitulo = document.getElementById('editTitulo').value;
    const novoPrecoRaw = document.getElementById('editPreco').value;
    const novoPreco = parseFloat(novoPrecoRaw).toFixed(2);
    const novaRelevancia = document.getElementById('editRelevancia').value;
    const novoStatus = document.getElementById('editStatus').value;
    const novoLocalizacao = document.getElementById('editLocalizacao').value;
    const novoDescricao = document.getElementById('editDescricao').value;
    const inputFotoEdit = document.getElementById('editArquivo');

    const finalizarAtualizacao = (fotoParaUsar) => {
        // 2. Atualiza os Atributos de Dados (Data-Attributes) na TR
        linhaSendoEditada.setAttribute('data-titulo', novoTitulo);
        linhaSendoEditada.setAttribute('data-preco', novoPreco);
        linhaSendoEditada.setAttribute('data-relevancia', novaRelevancia);
        linhaSendoEditada.setAttribute('data-status', novoStatus);
        linhaSendoEditada.setAttribute('data-localizacao', novoLocalizacao);
        linhaSendoEditada.setAttribute('data-descricao', novoDescricao);
        linhaSendoEditada.setAttribute('data-img', fotoParaUsar);

        // 3. Atualiza a Interface Visual na Tabela
        linhaSendoEditada.querySelector('.titulo-servico').innerText = novoTitulo;
        linhaSendoEditada.querySelector('.texto-localizacao').innerText = novoLocalizacao || 'Não informada';
        linhaSendoEditada.querySelector('.texto-descricao').innerText = novoDescricao || 'Sem descrição.';
        linhaSendoEditada.querySelector('.preco-servico').innerText = `R$ ${novoPreco.replace('.', ',')}`;
        linhaSendoEditada.querySelector('.img-servico').src = fotoParaUsar;

        // Atualiza Badge de Relevância
        const badgeRel = linhaSendoEditada.querySelector('.badge-relevancia');
        if (badgeRel) {
            badgeRel.className = `badge ${obtenerClasseRelevancia(novaRelevancia)} badge-relevancia d-block mt-1`;
            badgeRel.innerText = novaRelevancia;
        }

        // Atualiza Badge de Status
        const badgeStatus = linhaSendoEditada.querySelector('.badge-status');
        if (badgeStatus) {
            badgeStatus.className = `badge ${obtenerClasseStatus(novoStatus)} badge-status`;
            badgeStatus.innerText = novoStatus;
        }

        // 4. FECHAR O MODAL (Correção aqui)
        const modalElement = document.getElementById('modalEditarServico');
        const instance = bootstrap.Modal.getInstance(modalElement);
        if (instance) {
            instance.hide();
        }

        alert("Anúncio atualizado com sucesso!");
        linhaSendoEditada = null;
    };

    // Lógica para processar foto nova ou manter a antiga
    if (inputFotoEdit && inputFotoEdit.files && inputFotoEdit.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) { finalizarAtualizacao(e.target.result); }
        reader.readAsDataURL(inputFotoEdit.files[0]);
    } else {
        finalizarAtualizacao(linhaSendoEditada.getAttribute('data-img'));
    }
}

function previewFotoEdicao(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('editPreviewFoto').src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// ==========================================
// FUNÇÕES DA ABA PERFIL (ADICIONAR/REMOVER)
// ==========================================
function carregarDadosPerfil() {
    const usuario = DB.getUsuarioLogado();

    if (usuario) {
        const spanNomeTopo = document.getElementById('user-display-name');
        if (spanNomeTopo && usuario.nome) {
            const primeiroNome = usuario.nome.split(' ')[0]; 
            spanNomeTopo.innerText = primeiroNome;
        }

        if (document.getElementById('perfilNome')) document.getElementById('perfilNome').value = usuario.nome || '';
        if (document.getElementById('perfilEmail')) document.getElementById('perfilEmail').value = usuario.email || '';
        if (document.getElementById('perfilCPF')) document.getElementById('perfilCPF').value = usuario.cpf || '';
        if (document.getElementById('perfilTipo')) document.getElementById('perfilTipo').value = usuario.tipo || 'nao';

        const campoFoto = document.getElementById('perfilFoto');
        if (campoFoto && usuario.foto) {
            campoFoto.src = usuario.foto;
        }

        const campoTelefone = document.getElementById('perfilTelefone');
        if (campoTelefone) {
            campoTelefone.value = Array.isArray(usuario.telefones) ? usuario.telefones[0] : (usuario.telefone || '');
        }

        const campoEndereco = document.getElementById('perfilEndereco');
        if (campoEndereco) {
            campoEndereco.value = Array.isArray(usuario.enderecos) ? usuario.enderecos[0] : (usuario.endereco || '');
        }
    }
}

document.addEventListener('DOMContentLoaded', carregarDadosPerfil);

function adicionarCampo(containerId, tipo) {
    const container = document.getElementById(containerId);
    const placeholder = tipo === 'tel' ? '(00) 00000-0000' : 'Endereço completo';
    
    const novoCampo = `
        <div class="dynamic-field">
            <input type="text" class="form-control" placeholder="${placeholder}">
            <button type="button" class="btn btn-outline-danger border-0" onclick="removerCampo(this)">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', novoCampo);
}

function removerCampo(botao) {
    const container = botao.closest('#containerTelefones, #containerEnderecos');
    
    if (container && container.children.length > 1) {
        botao.closest('.dynamic-field').remove();
    } else {
        alert("Você precisa manter pelo menos um registro.");
    }
}

function salvarPerfil() {
    const usuarioLogado = DB.getUsuarioLogado();
    
    if (!usuarioLogado) {
        alert("Erro: Nenhum usuário logado encontrado.");
        return;
    }

    // 1. Captura os dados básicos
    const novoNome = document.getElementById('perfilNome').value.trim();
    const novoEmail = document.getElementById('perfilEmail').value.trim();
    
    // Atualiza os dados básicos no objeto
    usuarioLogado.nome = novoNome;
    usuarioLogado.email = novoEmail;

    // 2. Lógica de Alteração de Senha
    const senhaAtual = document.getElementById('perfilSenhaAtual').value;
    const novaSenha = document.getElementById('perfilNovaSenha').value;
    const confirmaSenha = document.getElementById('perfilConfirmaSenha').value;

    // Se o usuário digitou algo no campo de nova senha, processamos a troca
    if (novaSenha !== "") {
        // Verifica se a senha atual está correta
        if (senhaAtual !== usuarioLogado.senha) {
            alert("A senha atual informada está incorreta.");
            return; // Para a execução e não salva nada
        }

        // Verifica se as novas senhas coincidem
        if (novaSenha !== confirmaSenha) {
            alert("As novas senhas não coincidem. Tente novamente.");
            return;
        }

        // Validação de força da senha (mesma regra do seu Cadastro)
        const validaSenha = (senha) => {
            return senha.length >= 8 &&
                /[a-z]/.test(senha) &&
                /[A-Z]/.test(senha) &&
                /[0-9]/.test(senha) &&
                /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senha);
        };

        if (!validaSenha(novaSenha)) {
            alert("A nova senha é fraca. Use mínimo 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.");
            return;
        }

        // Se passou por todas as validações, atualiza a senha no objeto
        usuarioLogado.senha = novaSenha;
    }

    // 3. Salva o objeto atualizado de volta no "Banco de Dados" (localStorage)
    // Usamos o CPF como chave, exatamente como é feito no Cadastro
    localStorage.setItem(usuarioLogado.cpf, JSON.stringify(usuarioLogado));

    // 4. Atualiza a interface visual (Nome no topo)
    const spanNomeTopo = document.getElementById('user-display-name');
    if (spanNomeTopo) {
        spanNomeTopo.innerText = novoNome.split(' ')[0]; // Pega o primeiro nome
    }

    alert('Perfil atualizado com sucesso!');

    // 5. Limpa os campos de senha por segurança após salvar
    document.getElementById('perfilSenhaAtual').value = '';
    document.getElementById('perfilNovaSenha').value = '';
    document.getElementById('perfilConfirmaSenha').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarCategorias('catNovo', 'maquina');
});