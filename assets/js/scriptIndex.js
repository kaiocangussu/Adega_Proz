
// ======================================
// ADEGA DE MOC - LOJA
// Catálogo de produtos com imagens
// ======================================

const listaProdutos = document.getElementById("lista-produtos");
const pesquisaProduto = document.getElementById("pesquisaProduto");
const ordenarPreco = document.getElementById("ordenarPreco");

let categoriaSelecionada = "Todos";

// ======================================
// RECUPERAR PRODUTOS
// ======================================

function obterProdutos() {

    try {
        return JSON.parse(localStorage.getItem("Produtos")) || [];
    } catch {
        return [];
    }
}

// ======================================
// FORMATAR PREÇO
// ======================================

function formatarPreco(preco) {

    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ======================================
// EXIBIR PRODUTOS
// ======================================

function carregarProdutos() {

    const produtos = obterProdutos();

    const pesquisa = pesquisaProduto
        ? pesquisaProduto.value.trim().toLowerCase()
        : "";

    // PRIMEIRO: FILTRAR POR PESQUISA E CATEGORIA

    const produtosFiltrados = produtos.filter(produto => {

        const nome = (produto.nome || "").toLowerCase();
        const categoria = (produto.categoria || "").toLowerCase();

        const correspondePesquisa =
            nome.includes(pesquisa) ||
            categoria.includes(pesquisa);

        const correspondeCategoria =
            categoriaSelecionada === "Todos" ||
            categoria === categoriaSelecionada.toLowerCase() ||
            (
                categoriaSelecionada === "Outras bebidas" &&
                !["vinhos", "cervejas", "destilados"].includes(categoria)
            );

        return correspondePesquisa && correspondeCategoria;
    });

    // SEGUNDO: ORDENAR POR PREÇO

    let produtosOrdenados = [...produtosFiltrados];

    if (ordenarPreco) {

        switch (ordenarPreco.value) {

            case "menor":

                produtosOrdenados.sort(
                    (a, b) => Number(a.preco) - Number(b.preco)
                );

                break;

            case "maior":

                produtosOrdenados.sort(
                    (a, b) => Number(b.preco) - Number(a.preco)
                );

                break;

            case "promocao":

                produtosOrdenados = produtosOrdenados.filter(
                    produto => produto.promocao === true
                );

                break;
        }
    }

    // TERCEIRO: LIMPAR A LISTAGEM

    listaProdutos.innerHTML = "";

    // VERIFICAR SE EXISTEM PRODUTOS

    if (produtosOrdenados.length === 0) {

        const mensagem = document.createElement("p");

        mensagem.textContent = produtos.length === 0
            ? "Nenhum produto cadastrado ainda."
            : "Nenhum produto encontrado.";

        mensagem.className = "mensagem-vazia";

        listaProdutos.appendChild(mensagem);

        return;
    }

    // QUARTO: EXIBIR OS PRODUTOS

    produtosOrdenados.forEach(produto => {

        const artigo = document.createElement("article");

        artigo.className = "produto";

        // IMAGEM

        if (produto.imagem) {

            const imagem = document.createElement("img");

            imagem.src = produto.imagem;
            imagem.alt = produto.nome;

            imagem.className = "imagem-produto";
            imagem.loading = "lazy";

            artigo.appendChild(imagem);

        } else {

            const semImagem = document.createElement("div");

            semImagem.className = "imagem-sem-foto";
            semImagem.textContent = "📷";

            artigo.appendChild(semImagem);
        }

        // NOME

        const nome = document.createElement("h3");

        nome.textContent = produto.nome;

        // CATEGORIA

        const categoria = document.createElement("p");

        categoria.textContent = "Categoria: " + produto.categoria;

        // PREÇO

        const preco = document.createElement("div");

        preco.className = "preco";
        preco.textContent = formatarPreco(produto.preco);

        // BOTÃO

        const botao = document.createElement("button");

        botao.className = "btn-comprar";
        botao.textContent = "Adicionar ao carrinho";
        botao.type = "button";

        // MONTAR PRODUTO

        artigo.appendChild(nome);
        artigo.appendChild(categoria);
        artigo.appendChild(preco);
        artigo.appendChild(botao);

        listaProdutos.appendChild(artigo);
    });
}

// ======================================
// EVENTO DE PESQUISA
// ======================================

if (pesquisaProduto) {

    pesquisaProduto.addEventListener("input", carregarProdutos);
}

// ======================================
// EVENTO DE CATEGORIAS
// ======================================

document.querySelectorAll(".categoria").forEach(botao => {

    botao.addEventListener("click", () => {

        categoriaSelecionada = botao.textContent.trim();

        document.querySelectorAll(".categoria").forEach(item => {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        carregarProdutos();
    });
});

// ======================================
// EVENTO DE ORDENAÇÃO POR PREÇO
// ======================================

if (ordenarPreco) {

    ordenarPreco.addEventListener("change", carregarProdutos);
}

// ======================================
// INICIALIZAR
// ======================================

carregarProdutos();

// ======================================
// ATUALIZAR PRODUTOS EM OUTRA ABA
// ======================================

window.addEventListener("storage", event => {

    if (event.key === "Produtos") {
        carregarProdutos();
    }
});
