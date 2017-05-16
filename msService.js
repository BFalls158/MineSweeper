angular.module('app')
	.factory('msService', function(){

		return {
			createMinefield: createMinefield,
			checkWon: checkWon,
			revealAll: revealAll,
			chainEmpties: chainEmpties
		}

		function createMinefield() {
		    var minefield = {};
		    minefield.rows = [];
		    
		    for(var i = 0; i < 20; i++) {
		        var row = {};
		        row.cells = [];
		        
		        for(var j = 0; j < 20; j++) {
		            var cell = {};
		            cell.isRevealed = false;
		            cell.isBomb = Math.random() < .15;
		            cell.isFlagged = false;
		            cell.isClicked = false;
		            cell.x = i;
		            cell.y = j;
		            row.cells.push(cell);
		        }
		        
		        minefield.rows.push(row);
		    }
		    populateNumbers(minefield);
		    return minefield;
		}

		function calcNumber(minefield, row, col) {
			var cell = getCell(minefield, row, col);

			if(cell.isBomb) {
				return;
			}

			var mineCount = 0;

			// checks row above, assuming not first row
			if(row > 0) {
				//checks column to left, assuming isnt first
				if (col > 0) {
					var thisCell = getCell(minefield, row - 1, col - 1);
					//gets the cell above and to left
					if (thisCell.isBomb) {
						mineCount++;
					}
				}

				// get spot above
				var thisCell = getCell(minefield, row - 1, col);
				if(thisCell.isBomb) {
					mineCount++;
				}

				// make sure isn't last column
				if(col < 19) {
					// above and right
					var thisCell = getCell(minefield, row - 1, col + 1);
					if(thisCell.isBomb) {
						mineCount++;
					}
				}
			}

			//col to left !== first
			if(col > 0) {
				var thisCell = getCell(minefield, row, col - 1);
				if(thisCell.isBomb){
					mineCount++;
				}
			}

			//col !== last
			if(col < 19) {
				// get col to right
				var thisCell = getCell(minefield, row, col + 1);
				if(thisCell.isBomb){
					mineCount++;
				}
			}

			// check below if isnt last row
			if(row < 19) {
				//check left if not first
				if(col > 0) {
					// down and to the left
					var thisCell = getCell(minefield, row + 1, col - 1);
					if(thisCell.isBomb){
						mineCount++;
					}
				}

				//spot below
				var thisCell = getCell(minefield, row + 1, col);
				if(thisCell.isBomb) {
					mineCount++;
				}

				// check right if !== last col
				if(col < 19) {
					//below and right
					var thisCell = getCell(minefield, row + 1, col + 1);
					if(thisCell.isBomb) {
						mineCount++;
					}
				}
			}
			//check to see if cell needs a number
			if(mineCount > 0) {
				cell.contents = mineCount;
			} else if(mineCount === 0) {
				cell.contents = 0;
			}
		}


		function getCell(minefield, row, col) {
			return minefield.rows[row].cells[col];
		}

		function populateNumbers(minefield) {
			for(var y = 0; y < 20; y++) {
				for(var x = 0; x < 20; x++) {
					calcNumber(minefield, x, y);
				}
			}
		}

		function checkWon(minefield) {
			for(var y = 0; y < 20; y++) {
				for(var x = 0; x < 20; x++) {
					var thisCell = getCell(minefield, x, y);
					if(!thisCell.isBomb && !thisCell.isRevealed) {
						return false;
					}
				}
			}
			return true;
		}

		function revealAll(minefield) {
			for(var y = 0; y < 20; y++) {
				for(var x = 0; x < 20; x++) {
					var thisCell = getCell(minefield, x, y);
					if(thisCell.isFlagged && thisCell.isBomb) {
						thisCell.goodFlag = true;
					} else {
						thisCell.isRevealed = true;
					}
				}
			}
		}



		function chainEmpties(minefield, row, col) {

			var cell = getCell(minefield, row, col);
			if(cell.contents != 0) {
				return;
			}
				// checks row above, assuming not first row
				if(row > 0) {
					//checks column to left, assuming isnt first
					if (col > 0) {
						var thisCell = getCell(minefield, row - 1, col - 1);
						//gets the cell above and to left
						if (!thisCell.isRevealed && !thisCell.isBomb) {
							thisCell.isFlagged = false;
							thisCell.isRevealed = true;
							if(thisCell.contents == 0) {
								chainEmpties(minefield, row - 1, col - 1);
							}
						}
					}

					// get spot above
					var thisCell = getCell(minefield, row - 1, col);
					if (!thisCell.isRevealed && !thisCell.isBomb) {
						thisCell.isFlagged = false;
						thisCell.isRevealed = true;
						if(thisCell.contents == 0) {
							chainEmpties(minefield, row - 1, col);
						}
					}

					// make sure isn't last column
					if(col < 19) {
						// above and right
						var thisCell = getCell(minefield, row - 1, col + 1);
						if (!thisCell.isRevealed && !thisCell.isBomb) {
							thisCell.isFlagged = false;
							thisCell.isRevealed = true;
							if(thisCell.contents == 0) {
								chainEmpties(minefield, row - 1, col + 1);
							}
						}
					}
				}

				//col to left !== first
				if(col > 0) {
					var thisCell = getCell(minefield, row, col - 1);
					if (!thisCell.isRevealed && !thisCell.isBomb) {
						thisCell.isFlagged = false;
						thisCell.isRevealed = true;
						if(thisCell.contents == 0) {
							chainEmpties(minefield, row, col - 1);
						}
					}
				}

				//col !== last
				if(col < 19) {
					// get col to right
					var thisCell = getCell(minefield, row, col + 1);
					if (!thisCell.isRevealed && !thisCell.isBomb) {
						thisCell.isFlagged = false;
						thisCell.isRevealed = true;
						if(thisCell.contents == 0) {
							chainEmpties(minefield, row, col + 1);
						}
					}
				}

				// check below if isnt last row
				if(row < 19) {
					//check left if not first
					if(col > 0) {
						// down and to the left
						var thisCell = getCell(minefield, row + 1, col - 1);
						if (!thisCell.isRevealed && !thisCell.isBomb) {
							thisCell.isFlagged = false;
							thisCell.isRevealed = true;
							if(thisCell.contents == 0) {
								chainEmpties(minefield, row + 1, col - 1);
							}
						}
					}

					//spot below
					var thisCell = getCell(minefield, row + 1, col);
					if (!thisCell.isRevealed && !thisCell.isBomb) {
						thisCell.isFlagged = false;
						thisCell.isRevealed = true;
						if(thisCell.contents == 0) {
							chainEmpties(minefield, row + 1, col);
						}
					}

					// check right if !== last col
					if(col < 19) {
						//below and right
						var thisCell = getCell(minefield, row + 1, col + 1);
						if (!thisCell.isRevealed && !thisCell.isBomb) {
							thisCell.isFlagged = false;
							thisCell.isRevealed = true;
							if(thisCell.contents == 0) {
								chainEmpties(minefield, row + 1, col + 1);
							}
						}
					}
				}
		}	

	});


		