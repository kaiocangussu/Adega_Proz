
// ======================================
// ADEGA DE MOC - ADMINISTRAÇÃO
// Cadastro, edição e exclusão de produtos
// ======================================

// ELEMENTOS DO HTML
const formCadastro = document.getElementById("formCadastro");
const listaProdutos = document.getElementById("itens");

// Controle de edição
let isEditando = null;

// Recuperar produtos do LocalStorage
function obterProdutos() {
    return JSON.parse(localStorage.getItem("Produtos")) || [];
}

// Salvar produtos no LocalStorage
function salvarProdutos(produtos) {
    localStorage.setItem("Produtos", JSON.stringify(produtos));
}

// ======================================
// CADASTRAR E EDITAR PRODUTOS
// ======================================

formCadastro.onsubmit = (event) => {
    event.preventDefault();

    // Pegar valores do formulário
    const nomeProdutoDigitado =
        document.getElementById("nome").value.trim();

    const precoProdutoDigitado =
        Number(document.getElementById("preco").value.replace(",", "."));

    const categoriaProdutoDigitado =
        document.getElementById("categoria").value.trim();

    // Validar campos
    if (
        !nomeProdutoDigitado ||
        !categoriaProdutoDigitado ||
        !Number.isFinite(precoProdutoDigitado) ||
        precoProdutoDigitado <= 0
    ) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    // Criar objeto do produto
    const produto = {
        nome: nomeProdutoDigitado,
        preco: precoProdutoDigitado,
        categoria: categoriaProdutoDigitado
    };

    // Recuperar produtos
    const produtosLocalStorage = obterProdutos();

    // Verificar se está editando ou cadastrando
    if (isEditando !== null) {
        produtosLocalStorage[isEditando] = produto;
    } else {
        produtosLocalStorage.push(produto);
    }

    // Salvar alterações
    salvarProdutos(produtosLocalStorage);

    // Limpar formulário e atualizar tabela
    formCadastro.reset();
    isEditando = null;

    carregarProdutos();

    alert("Produto salvo com sucesso!");
};

// ======================================
// CARREGAR PRODUTOS NA TABELA
// ======================================

function carregarProdutos() {

    const produtosLocalStorage = obterProdutos();

    // Limpar tabela
    listaProdutos.innerHTML = "";

    // Verificar se existem produtos
    if (produtosLocalStorage.length === 0) {
        listaProdutos.innerHTML = `
            <tr>
                <td colspan="4">
                    Nenhum produto cadastrado.
                </td>
            </tr>
        `;
        return;
    }

    // Criar linhas da tabela
    produtosLocalStorage.forEach((produto, index) => {

        const linha = document.createElement("tr");

        const nome = document.createElement("td");
        nome.textContent = produto.nome;

        const preco = document.createElement("td");
        preco.textContent = Number(produto.preco).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

        const categoria = document.createElement("td");
        categoria.textContent = produto.categoria;

        const acoes = document.createElement("td");

        // Botão editar
        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.type = "button";
        botaoEditar.className = "btn-editar";

        botaoEditar.onclick = () => editarProduto(index);

        // Botão excluir
        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.type = "button";
        botaoExcluir.className = "btn-excluir";

        botaoExcluir.onclick = () => excluirProduto(index);

        acoes.appendChild(botaoEditar);
        acoes.appendChild(botaoExcluir);

        // Adicionar células à linha
        linha.appendChild(nome);
        linha.appendChild(preco);
        linha.appendChild(categoria);
        linha.appendChild(acoes);

        // Adicionar linha à tabela
        listaProdutos.appendChild(linha);
    });
}

// ======================================
// EXCLUIR PRODUTO
// ======================================

function excluirProduto(index) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmar) return;

    const produtosLocalStorage = obterProdutos();

    produtosLocalStorage.splice(index, 1);

    salvarProdutos(produtosLocalStorage);

    carregarProdutos();

    // Cancelar edição caso o produto editado tenha sido excluído
    if (isEditando === index) {
        isEditando = null;
        formCadastro.reset();
    } else if (isEditando !== null && isEditando > index) {
        isEditando--;
    }
}

// ======================================
// EDITAR PRODUTO
// ======================================

function editarProduto(index) {

    const produtosLocalStorage = obterProdutos();

    const produto = produtosLocalStorage[index];

    if (!produto) return;

    document.getElementById("nome").value = produto.nome;
    document.getElementById("preco").value = produto.preco;
    document.getElementById("categoria").value = produto.categoria;

    // Permite editar inclusive o índice 0
    isEditando = index;

    formCadastro.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// ======================================
// INICIALIZAR TABELA
// ======================================

carregarProdutos();
