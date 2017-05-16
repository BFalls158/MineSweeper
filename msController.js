angular.module('app')
	.controller('msController', function($scope, msService){

		$scope.minefield = msService.createMinefield();

		$scope.flag = false;

		$scope.flagToggle = function (){
			if($scope.flag) {
				$scope.flag = false;
			} else {
				$scope.flag = true;
			}
		}

		$scope.reveal = function(cell) {
			if(!$scope.flag){
				cell.isRevealed = true;
				if(cell.isBomb){
					$scope.loseMessage = true;
					msService.revealAll($scope.minefield);
				} else {
					msService.chainEmpties($scope.minefield, cell.x, cell.y);
					if(msService.checkWon($scope.minefield)){
					$scope.winMessage = true;
					}
				}
			} else {
				if (!cell.isFlagged){
					cell.isFlagged = true;
				} else {
					cell.isFlagged = false;
				} 
			}
		}

		$scope.newGame = function(){
			$scope.minefield = {};
			$scope.minefield = msService.createMinefield();
			$scope.loseMessage = false;
			$scope.winMessage = false;
		}
	});