/*******************************************
		Controller de Home
*******************************************/
var homeCtrl = function ($scope, $rootScope, $location, genericAPI, $uibModal, SweetAlert, $timeout, $interval) {

	//verifica sessao
	// if(!$rootScope.usuario) {
	// 	$location.path('/login');
	// 	return false;
	// }

	$scope.usuario = {
		"nome":"",
		"derrotas":0,
		"vitorias":0
	}

	if(localStorage.usuario!==undefined) {
		$scope.usuario = JSON.parse(localStorage.usuario);
	} 

	$scope.obj = {
		nome:""
	}

	$scope.cards = [
		{
			'nome': 'Adam',
			'pontos': -5,
			'src':'libs/img/adam.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Eve',
			'pontos': -5,
			'src':'libs/img/eve.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Alquimista',
			'pontos': 10,
			'src':'libs/img/alquimista.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Bruxa',
			'pontos': 10,
			'src':'libs/img/bruxa.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Diaba',
			'pontos': 10,
			'src':'libs/img/diaba.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Dino Verde',
			'pontos': 15,
			'src':'libs/img/dinoverde.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Elfo',
			'pontos': -10,
			'src':'libs/img/elfo.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Frango',
			'pontos': 20,
			'src':'libs/img/frango.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Lamina',
			'pontos': 20,
			'src':'libs/img/lamina.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Maneiro',
			'pontos': -5,
			'src':'libs/img/maneiro.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Melodia',
			'pontos': 10,
			'src':'libs/img/melodia.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Mercenário',
			'pontos': 10,
			'src':'libs/img/mercenario.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Squido',
			'pontos': -999,
			'src':'libs/img/polvo.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Quarterback',
			'pontos': -15,
			'src':'libs/img/quarterback.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Raver',
			'pontos': 10,
			'src':'libs/img/raver.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Steampunk',
			'pontos': 10,
			'src':'libs/img/steampunk.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Vontade',
			'pontos': 25,
			'src':'libs/img/vontade.PNG',
			'desativado':false,
			'suspeito':false
		},
		{
			'nome': 'Smoking',
			'pontos': 25,
			'src':'libs/img/smoking.PNG',
			'desativado':false,
			'suspeito':false
		}
	];

	var setado = 0;
	$scope.interrogacoes = 15;
	$scope.pista = 0;
	$scope.time = '00:01:00';
	$scope.iniciado = false;
	var interval = null;
	$scope.creditoRadar = 1;
	$scope.suspeitos = [];

	var resetSuspeito = function () {
		for (c of $scope.cards) {
			c.suspeito = false;
		}
	}
	var reset = function () {
		$scope.interrogacoes = 15;
		$scope.pista = 0;
		setado = 0;
		$scope.iniciado = false;
		$scope.time = '00:01:00';
		$scope.creditoRadar = 1;
		$scope.suspeitos = [];
		for (c of $scope.cards) {
			c.desativado = false;
		}
		$interval.cancel(interval);
		resetSuspeito();
	}

	$scope.iniciar = function (obj) {

		if ($scope.usuario.nome==='') {
			$scope.usuario.nome = obj.nome.substr(0,10);
			localStorage.usuario = JSON.stringify($scope.usuario);
		}

		$scope.iniciado = true;
		interval = $interval(function() {
			$scope.time = moment($scope.time, 'HH:mm:ss').subtract('1', "second").format('HH:mm:ss');
			if ($scope.time === '00:00:00') {
				SweetAlert.swal({ 
					html: true, 
					title: "Tempo Esgotado!", 
					text: 'Você demorou de mais o tempo acabou!', 
					type: "error" 
				});
				reset();
			}
		}, 1000);
	}

	$scope.segredos = [
		"\"Eu estava lá, todos estavam, mas poucos vão querer falar alguma coisa... afinal quem nunca..\"",
		"\"É meu amigo, o rombo foi grande, eles estão agora atrás de quem cometeu esse furo.. alguém vai ter problemas...\"",
		"\"Eu não estava lá... eu juro... não me olhe com essa cara de desconfiado, mas eu ouvi coisas... disseram que foi um grande roubo no Banco dos Diamantes.. bem.. foi o que eu ouvi..\"",
		"\"Naquela noite a cidade sofria um blackout, uma forte chuva atingia a cidade de Peak a Mars Eletric ninguém via nada eu estava ilhado próximo ao banco dos diamantes esperando o temporal passar, então eu vi, ele aproveitou pra saquear o banco, tudo por causa daquela roupa cara...\""
	];

	var verificaDeativados = function (x, setado) {
		if (+x === +setado) {
			return true;
		}
		for (var i=0; i<$scope.cards.length;i++) {
			if ($scope.cards[i].desativado && +i=== +x) {
				return true;
			}
		}
		return false;
	}

	var setaPersonagem = function () {
		var x = setado;
		while (verificaDeativados(x, setado)) {
			x = (Math.random() * 17).toFixed(0);
		}
		setado = x;
		// console.log(setado);
	}
	setaPersonagem();

	$scope.clicado = function (card, index) {
		if (card.desativado === true) return false;
		if (+index === +setado) {
			card.desativado = true;
			SweetAlert.swal({ 
				html: true, 
				title: "Achou um Segredo!", 
				text: '<b>'+card.nome+':</b> ' + $scope.segredos[$scope.pista], 
				type: "success" 
			});
			$scope.pista++;
			if ($scope.pista>=5) {
				SweetAlert.swal({
					title: "Incrível!!!",
					text: '<b>Parabéns você venceu com '+$scope.time+'!<br>O Frango fez um grande rombo no banco de diamantes só pra conseguir essa roupa!</b><br><br><div class="segredo"><img src="'+$scope.cards[7].src+'"></div>',
					type: "success",
					html: true,
					confirmButtonColor: "#5cb85c",
					confirmButtonText: "Finalizar",
					closeOnConfirm: false,
				},
					function (isConfirm) {
						swal.close();
						if (isConfirm) {
							reset();
						}
					}
				)
				$interval.cancel(interval);
				$scope.usuario.vitorias++;
				localStorage.usuario = JSON.stringify($scope.usuario);
			}
		}else{
			if ($scope.suspeitos.length===0) $scope.interrogacoes--;
			SweetAlert.swal({ 
				html: true, 
				title: "Interrogou a pessoa errada!", 
				text: '<b>'+card.nome+':</b> ' + "Sinto muito... seu segredo não está comigo...", 
				type: "warning" 
			});

			if ($scope.interrogacoes<=0) {
				SweetAlert.swal({ html: true, title: "Não deu!", text: "Acabaram suas tentativas o jogo foi reiniciado!", type: "error" });
				$scope.usuario.derrotas++;
				localStorage.usuario = JSON.stringify($scope.usuario);
				reset();
			}
		}
		resetSuspeito();
		setaPersonagem();
		$scope.suspeitos = [];
	}

	var setaSuspeitos = function () {
		$scope.suspeitos = [setado];
		$scope.cards[setado].suspeito = true;
		while ($scope.suspeitos.length < 3) {
			var x = (Math.random() * 17).toFixed(0);
			if ($scope.suspeitos.indexOf(x)==-1) {
				if (!$scope.cards[x].desativado) {
					$scope.suspeitos.push(x);
					$scope.cards[x].suspeito = true;
				}
			}
		}
	}

	
	$scope.acionarRadar = function () {

		if ($scope.suspeitos.length>0) {
			SweetAlert.swal({ html: true, title: "Radar já está acionado!", text: "O Radar já está acionado! Interrogue para usar novamente.", type: "error" });
			return false;
		};

		var acionar = false;
		if ($scope.creditoRadar >= 1) {
			acionar = true;
		}else{
			if ($scope.interrogacoes>=2) {
				acionar = true;
			}
		}

		if (!acionar) {
			SweetAlert.swal({ html: true, title: "Não permitido!", text: "Sinto muito, Interrogações insuficientes para acionaro Radar.", type: "error" });
			return false;
		}

		var text = "Encontre 3 suspeitos<br> 1 deles terá o segredo!<br><br><b>Custo 2 interrogações<b>";
		if ($scope.creditoRadar >= 1) text = "Encontre 3 suspeitos<br> 1 deles terá o segredo!<br><br><b>1 Acionamento Grátis<b>";


		SweetAlert.swal({
			title: "Acionar o Radar?",
			text: text,
			type: "warning",
			html: true,
			showCancelButton: true,
			confirmButtonColor: "#5cb85c",
			confirmButtonText: "Acionar",
			cancelButtonText: "Cancele",
			closeOnConfirm: false,
			closeOnCancel: false
		},
			function (isConfirm) {
				swal.close();
				if (isConfirm) {
					if ($scope.creditoRadar===0) $scope.interrogacoes += -2;
					$scope.creditoRadar = 0;
					setaSuspeitos();
					MyToast.show('O Radar foi ativado!', 3);
				}
			}
		)
	}
}


angular
	.module('cfp')
	.controller('homeCtrl', homeCtrl);