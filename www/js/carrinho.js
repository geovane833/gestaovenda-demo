var localCarrinho = localStorage.getItem('carrinho');

if(localCarrinho){
    var carrinho = JSON.parse(localCarrinho);
    if(carrinho.length > 0){
        //TEM ITENS NO CARRINHO
        //RENDERIZAR O CARRINHO
        renderizarCarrinho();
        //SOMAR TOTAIS DOS PRODUTOS
        calcularTotal();
    } else {
        //MOSTRAR CARRINHO VAZIO
        carrinhoVazio();
    }
} else {
    //MOSTRAR CARRINHO VAZIO
    carrinhoVazio();
}

function renderizarCarrinho(){
    //ESVAZIAR A AREA DOS ITENS
    $("listaCarrinho").empty();

    //PERCORRER O NOSSO CARRINHO E ALIMENTAR A AREA
    $.each(carrinho, function(index, itemCarrinho){
        var itemDiv = `
            <!-- ITEM DO CARRINHO-->
                        <div class="item-carrinho">
                            <div class="area-img">
                                <img src="${itemCarrinho.item.imagem}">
                            </div>
                            <div class="area-details">
                                <div class="sup">
                                    <span class="name-prod">
                                    ${itemCarrinho.item.nome}
                                    </span>
                                    <a data-index="${index}" class="delete-item" href="#"><i class="mdi mdi-close"></i></a>
                                </div>
                                <div class="middle">
                                    <span>${itemCarrinho.item.principal_caracteristica}</span>
                                </div>
                                <div class="preco-quantidade">
                                    <span>${itemCarrinho.item.preco_promocional.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>
                                    <div class="count">
                                        <a class="minus" data-index="${index}" href="#">-</a>
                                        <input readonly class="qtd-item" type="text" value=" ${itemCarrinho.quantidade}">
                                        <a class="plus" data-index="${index}" href="#">+</a>
                                    </div>
                                </div>
                                    
                            </div>
                        </div>
        `;
        $("#listaCarrinho").append(itemDiv);
    });

    $(".delete-item").on('click', function(){
        var index = $(this).data('index');
        //CONFIRMAR
        app.dialog.confirm('Tem certeza que quer remover este item?', 'Remover', function(){
            //REMOVER ITEM DO CARRINHO
            carrinho.splice(index, 1);
            //ATUALIZAR O CARRINHO COM ITEM REMOVIDO
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            //ATUALIZAR A PAGINA
            app.views.main.router.refreshPage();
        });
    });

    $(".minus").on('click', function(){
        var index = $(this).data('index');
        
        //SE TEM MAIS DE UM ITEM NA QUANTIDADE
        if(carrinho[index].quantidade > 1){
            carrinho[index].quantidade --;
            carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            app.views.main.router.refreshPage();
        }else{
            var itemname= carrinho[index].item.nome;
            app.dialog.confirm(`Gostaria de remover <strong>${itemname}</strong>?`, 'REMOVER', function(){
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                app.views.main.router.refreshPage();
               
            });
        }
    });

    $(".plus").on('click', function(){
        var index = $(this).data('index');
        
        carrinho[index].quantidade++;
        carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
       app.views.main.router.refreshPage();
    
    });
}

function calcularTotal(){
    var totalCarrinho = 0;
    $.each(carrinho, function(index, itemCarrinho){
        totalCarrinho += itemCarrinho.total_item;
    });
    //MOSTRAR O TOTAL
    $("#subtotal").html(totalCarrinho.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));
}

function carrinhoVazio(){
    console.log('carrinho está vazio');
    $("#listaCarrinho").empty();

    //SUMIR OS ITENS DE BAIXO BOTÂO DO CARRINHO
    $("#toolbarTotais").addClass('display-none');
    $("#toolbarCheckout").addClass('display-none');

    //MOSTRAR SACOLINHA VAZIA
    $("#listaCarrinho").html(`
        <div class="text-align-center">
            <img width="300" src="img/empty.gif">
            <br><span class="color-gray">Nada por enquanto...</span>
        </div>
    `);
}

$("#esvaziar").on('click', function(){
    app.dialog.confirm('Tem certeza que quer esvaziar o carrinho?', '<strong>ESVAZIAR </strong>', function(){
        //APAGAR O LOCALSTORAGE DO CARRINHO
        localStorage.removeItem('carrinho');
        app.views.main.router.refreshPage();//atualizar a pagina
    });
})

