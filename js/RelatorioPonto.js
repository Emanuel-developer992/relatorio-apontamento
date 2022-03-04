window.onload = function() {
    datasets();    
};

function datasets() {
    
    var form = DatasetFactory.getDataset("DSFormulariodeCadastrodeFuncionario", null, null, null);

    var nRow = form.values.length

    for (var i = 0; i < nRow; i++) {

        var matricula = form.values[i].matricula;

        $('#matricula').append($('<option>', {

            value: matricula,
            text: matricula
        }));
    }
    
}

$(document).on('change', "#matricula",
    function filtro1() {
        loading();
        setTimeout(function(){ filter(); }, 100);
        
    });

$(document).on('change', "#mes",
    function filtro2() {
        loading();
        setTimeout(function(){ filter(); }, 100);
    });

$(document).on('change', "#ano",
    function filtro3() {
        loading();
        setTimeout(function(){ filter(); }, 100);
    });

function DiasDoMes(mes, ano) {
    var dias = new Date(ano, mes, 0);
    return dias.getDate();
};

function filter() {
    var matricula = $("#matricula").val();
    var mes = $("#mes").val();
    var ano = $("#ano").val();
    var dSemana = ['Domingo', 'Segunda-Ferira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
    var th = 0;
    var tmin = 0;

    if (matricula != "" && mes != "" && ano != "") {
        $('#info').removeClass('nav-close');
        clearTable('tb_ponto');
        tbHeader();
        header();
        tb_top();
        $('#tbDiv').removeClass('nav-close');
        $('#export').removeClass('nav-close');

        $('#matricula').prop('readonly', true);
        $('#mes').prop('readonly', true);
        $('#ano').prop('readonly', true);


        var c1 = DatasetFactory.createConstraint("matricula", matricula, matricula, ConstraintType.MUST);

        var maxDia = DiasDoMes(mes, ano);
        var clickCR = 0;

        for(var i = 1; i <= maxDia; i++) {

            clickCR++;
            var aTb = [];
            var table = document.getElementById("tb_ponto");
            

            if(i < 10) {
                i = '0'+i;
            }

            var fDate = i+'/'+mes+'/'+ano; 
            var fDate2 = ano+'-'+mes+'-'+i; 
            var c2 = DatasetFactory.createConstraint("date_log", fDate, fDate, ConstraintType.SHOULD);
            var c3 = DatasetFactory.createConstraint("date_log", fDate2, fDate2, ConstraintType.SHOULD);
            var constraints = new Array(c1, c2, c3);
            var dataset = DatasetFactory.getDataset("DSFormulariodeRegistrodeHorasTrabalhadas", null, constraints, null);
            var horaExtra = DatasetFactory.getDataset("DSFormulariodeHoraExtra", null, constraints, null);

            var valid = dataset.values.length;
            var valid2 = horaExtra.values.length;

            if (valid > 0) {
                var tbdata = dataset.values[0].date_log;
                var tbdia = dataset.values[0].day_log;
                var tbentra = dataset.values[0].entrada_log;
                var tbinterv = dataset.values[0].intervaloS_log;
                var tbreturn = dataset.values[0].retorno_log;
                var tbsaida = dataset.values[0].saida_log;
                if(valid2 > 0) {
                    var tbhe = horaExtra.values[0].he;
                } else {
                    var tbhe = "00:00"
                }
                
            } else {
                var tbdata = fDate;
                var semana = new Date(ano, mes, i);
                semana = semana.getDay();
                var tbdia = dSemana[semana];

                if (semana == 0 || semana == 6) {
                    var tbentra = 'DSR'
                    var tbinterv = 'DSR'
                    var tbreturn = 'DSR'
                    var tbsaida = 'DSR'
                } else {
                    var tbentra = ""
                    var tbinterv = ""
                    var tbreturn = ""
                    var tbsaida = ""
                }
                if(valid2 > 0) {
                    var tbhe = horaExtra.values[0].he;
                } else {
                    var tbhe = "00:00"
                }
            }

            if (tbentra != 'DSR' && tbentra != "") {

                var h1 = tbentra.substring(0, 2);
                var m1 = tbentra.substring(3, 5);
                var h2 = tbinterv.substring(0, 2);
                var m2 = tbinterv.substring(3, 5);
                var h3 = tbreturn.substring(0, 2);
                var m3 = tbreturn.substring(3, 5);
                var h4 = tbsaida.substring(0, 2);
                var m4 = tbsaida.substring(3, 5);

                var mt1 = (parseInt(h1) * 60) + parseInt(m1);
                var mt2 = (parseInt(h2) * 60) + parseInt(m2);
                var mt3 = (parseInt(h3) * 60) + parseInt(m3);
                var mt4 = (parseInt(h4) * 60) + parseInt(m4);


                var mt = ((mt2 - mt1) + (mt4 - mt3))/60;

                if (mt > 9) {
                    var h = mt.toString().substring(0, 2);
                } else {
                    var h = mt.toString().substring(0, 1);
                }

                var minInd = mt - parseInt(h);

                if (minInd != 0) {
                    var min = (minInd * 60).toFixed(0);
                    if (min < 10) {
                        min = "0"+min;
                    }
                } else {
                    var min = "00"
                }

                if (parseInt(h) < 10) {
                    h = "0"+h;
                }

            } else {
                var h = '00';
                var min = '00';
            }

            var hrs = h+":"+min;
             
            aTb.push(fDate);
            aTb.push(tbdia);
            aTb.push(tbentra);
            aTb.push(tbinterv);
            aTb.push(tbreturn);
            aTb.push(tbsaida);
            aTb.push(tbhe);
            aTb.push(hrs);
            
            
            var newRow = table.insertRow(clickCR);
            
            for (var y = 0; y < 8; y++) {
                
                newCell = newRow.insertCell(y);
                newCell.innerHTML = aTb[y];
            }

            th = parseInt(hrs.substring(0, 2)) + th;
            tmin = parseInt(hrs.substring(3, 5)) + tmin;

        }

        var thrs = ((th*60)+tmin)/60;

        if (thrs > 99) {
            var tth = thrs.toString().substring(0, 3);
        } else if (thrs > 9){
            var tth = thrs.toString().substring(0, 2);
        } else {
            var tth = thrs.toString().substring(0, 1);
        }

        var indice = thrs - parseInt(tth);

        if (indice != 0) {
            var ttmin = (indice * 60).toFixed(0);
        } else {
            var ttmin = 0;
        }

        if (tth < 10) {
            tth = '0'+tth;
        }
        if (ttmin < 10) {
            ttmin = '0'+ttmin;
        }

    }

    var label = $('#extratoH');
    label[0].innerHTML = extratoHoras()+'    Total de Horas Trabalhadas: '+'<h3>'+tth+'Hrs.'+' '+ttmin+'Min.'+'</h3>'

    $("#loading").addClass('nav-close');
};

function tbHeader() {
    var cabecalho = [];
    var table = document.getElementById("tb_ponto");
    
    //1ª tabela
    cabecalho.push("<b>Data</b>"); 
    cabecalho.push("<b>Dia da Semana</b>"); 
    cabecalho.push("<b>Entrada</b>"); 
    cabecalho.push("<b>Intervalo</b>"); 
    cabecalho.push("<b>Retorno</b>"); 
    cabecalho.push("<b>Saída</b>"); 
    cabecalho.push("<b>Hora Extra</b>"); 
    cabecalho.push("<b>Horas Trabalhadas</b>"); 
    
    var rowHead = table.insertRow(0);
    
    for (var x = 0; x < 8; x++) {
        headCell = rowHead.insertCell(x);
        headCell.innerHTML = cabecalho[x];
    }

};

function header() {

    var matricula = $("#matricula").val();
    var c1 = DatasetFactory.createConstraint("matricula", matricula, matricula, ConstraintType.MUST);
    var constraint = new Array(c1);
    var dataset = DatasetFactory.getDataset("DSFormulariodeCadastrodeFuncionario", null, constraint, null);

    var nome = dataset.values[0].name_func;
    var cpf = dataset.values[0].cpf;
    var ctps = dataset.values[0].ctps;
    var cargo = dataset.values[0].funcao;
    var hrs1  = dataset.values[0].hrs_trab.substring(0, 5);
    var hrs2  = dataset.values[0].hrs_trab.substring(8, 13);
    var hrs3  = dataset.values[0].hrs_trab.substring(16, 21);
    var hrs4  = dataset.values[0].hrs_trab.substring(24, 29);
    var dias = "";

    var dom = dataset.values[0].dom;
    var seg = dataset.values[0].seg;
    var ter = dataset.values[0].ter;
    var qua = dataset.values[0].qua;
    var qui = dataset.values[0].qui;
    var sex = dataset.values[0].sex;
    var sab = dataset.values[0].sab;

    if (seg != "") {
        dias = dias+' Segunda'
    }
    if (ter != "") {
        dias = dias+' Terça'
    }
    if (qua != "") {
        dias = dias+' Quarta'
    }
    if (qui != "") {
        dias = dias+' Quinta'
    }
    if (sex != "") {
        dias = dias+' Sexta'
    }
    if (sab != "") {
        dias = dias+' Sábado'
    }
    if (dom != "") {
        dias = dias+' Domingo'
    }

    $('#nameF').val(nome);
    $('#cpf').val(cpf);
    $('#ctps').val(ctps);
    $('#cargo').val(cargo);
    $('#hrs').val(dias);
    $('#entrada').val(hrs1);
    $('#intervalo').val(hrs2);
    $('#retorno').val(hrs3);
    $('#saida').val(hrs4);

};

function clearTable(tb) {

    $('#'+tb+' tr').remove();
};

var av = 0;
function printDiv(divId) {

    var mat = $('#matricula').val();
    var name = $('#nameF').val();
    var mes = $('#mes').val();
    var ano = $('#ano').val();
    var nomeMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    var de = $("#de").val();
    var ate = $("#ate").val();

    var date1 = de.substring(8, 10)+'/'+de.substring(5, 7)+'/'+de.substring(0, 4);
    var date2 = ate.substring(8, 10)+'/'+ate.substring(5, 7)+'/'+ate.substring(0, 4);

    if (av == 0) {
        var title = mat+' - '+name+' '+nomeMes[parseInt(mes)]+', '+ano;
    } else {
        var title = 'Relatório Geral: '+date1+' - '+date2;
    }
  
    var style = "<style>";
    style = style + "table {width: 100%;font: 20px Calibri;margin-bottom: 30px;font-size: 12px}";
    style = style + "table, th, td {border: solid 1px #000000; border-collapse: collapse;";
    style = style + "padding: 2px 3px;text-align: center;}";
    style = style + "</style>";
  
    let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
  
    mywindow.document.write(`<html><head><title>${title}</title>`);
    mywindow.document.write(style);
    mywindow.document.write('</head><body >');
    mywindow.document.write(document.getElementById(divId).innerHTML);
    mywindow.document.write('</body></html>');
  
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
  
    mywindow.print();
    mywindow.close();

    $('#solict').removeClass('nav-close');
    $('#pdfGeral').addClass('nav-close');
    window.location.reload(true);
  
    return true;
  }		

function reloadUser() {
    $('#nameF').val("");
    $('#cpf').val("");
    $('#ctps').val("");
    $('#cargo').val("");
    $('#hrs').val("");
    $('#entrada').val("");
    $('#intervalo').val("");
    $('#retorno').val("");
    $('#saida').val("");
    
    $('#matricula').val("");
    $('#mes').val("");
    $('#ano').val("");

    $('#matricula').prop('readonly', false);
    $('#mes').prop('readonly', false);
    $('#ano').prop('readonly', false);

    $('#tbDiv').addClass('nav-close');
    $('#info').addClass('nav-close');
    $('#export').addClass('nav-close');

};

function extratoHoras() {
    var table = $('#tb_ponto tr');
    
    var rowTb = table.length;
    var horas = 0;
    var min = 0;
    var sHoras = 0;
    var sMin = 0;

    for (var i = 1; i < rowTb; i++) {

        var extra = table[i].cells[6].innerHTML;

        if (extra != "00:00") {
            horas = extra.substring(0, 2);
            horas = parseInt(horas);

            sHoras = sHoras + horas;

            min = extra.substring(3, 5);
            min = parseInt(min);

            sMin = sMin + min;
        }

    }

    var result = sMin/60;

    if (result >= 1) {
        var nVar = sMin.toString();
        nVar = nVar.substring(0, 1);
        nVar = parseInt(nVar);
        var minHoras = nVar * 60;

        sMin = sMin - minHoras;
        sHoras = sHoras + nVar;
    };

    return 'Total de Horas Extras: '+'<h3>'+sHoras+'Hrs.'+' '+sMin+'Min.'+'</h3>';
}

function loading() {
    var matricula = $("#matricula").val();
    var mes = $("#mes").val();
    var ano = $("#ano").val();

    if (matricula != "" && mes != "" && ano != "") {
    $("#loading").removeClass('nav-close');
    }
}

function topHeader() {
    var cabecalho = [];
    var table = document.getElementById("tb_top");
    
    //1ª tabela
    cabecalho.push("<b>Nome</b>"); 
    cabecalho.push("<b>CPF</b>"); 
    cabecalho.push("<b>Matrícula</b>"); 
    cabecalho.push("<b>Cargo</b>"); 
    cabecalho.push("<b>Dias de Trabalho</b>"); 
    cabecalho.push("<b>Horário de Trabalho</b>"); 
    
    var rowHead = table.insertRow(0);
    
    for (var x = 0; x < 6; x++) {
        headCell = rowHead.insertCell(x);
        headCell.innerHTML = cabecalho[x];
    }

};

function tb_top() {
    var cabecalho = [];
    var table = document.getElementById("tb_top");
    clearTable('tb_top');
    topHeader();

    setTimeout(function(){  
        var nome = $('#nameF').val();
        var cpf = $('#cpf').val();
        var matricula = $('#matricula').val();
        var cargo = $('#cargo').val();
        var dias = $('#hrs').val();
        var entrada = $('#entrada').val();
        var intervalo = $('#intervalo').val();
        var retorno = $('#retorno').val();
        var saida = $('#saida').val();

        //1ª tabela
        cabecalho.push(nome); 
        cabecalho.push(cpf); 
        cabecalho.push(matricula); 
        cabecalho.push(cargo); 
        cabecalho.push(dias); 
        cabecalho.push(entrada+"-"+intervalo+"-"+retorno+"-"+saida); 
        
        
        var rowHead = table.insertRow(1);
        
        for (var x = 0; x < 6; x++) {
            headCell = rowHead.insertCell(x);
            headCell.innerHTML = cabecalho[x];
        }
    }, 100);

};

var errorValid = 0;
function allFunc() {

    var mes = $("#mes").val();
    var ano = $("#ano").val();
    var dSemana = ['Domingo', 'Segunda-Ferira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
    var th = 0;
    var tmin = 0;
    var clickCR = 0;

    if ( mes != "" && ano != "") {
        clearTable('tb_all');
        
        var tbBase = DatasetFactory.getDataset("DSFormulariodeCadastrodeFuncionario", null, null, null);
        var nDataset = tbBase.values.length;

        for (var z = 0; z < nDataset; z++) {

            var matricula = tbBase.values[z].matricula;
            var maxDia = DiasDoMes(mes, ano);        

            var cabecalho = [];
            var cabecalho2 = [];
            var cabecalho3 = [];
            var table = document.getElementById("tb_all");
            
            
            //1ª tabela
            cabecalho.push("<b>Matricula</b>"); 
            cabecalho.push("<b>Nome</b>"); 
            cabecalho.push("<b>Empresa</b>"); 
            cabecalho.push("<b>Função</b>"); 
            cabecalho.push("<b>CPF</b>"); 
            cabecalho.push("<b>RG</b>"); 
            cabecalho.push("<b>Nº CTPS</b>");
            cabecalho.push("<b>Horário Padrão</b>"); 

            var rowHead = table.insertRow(clickCR);
            clickCR++;
            
            for (var x = 0; x < 8; x++) {
                headCell = rowHead.insertCell(x);
                headCell.innerHTML = cabecalho[x];
            }

            var c1 = DatasetFactory.createConstraint("matricula", matricula, matricula, ConstraintType.MUST); 
            var constraints = new Array(c1);
            var dataset = DatasetFactory.getDataset("DSFormulariodeCadastrodeFuncionario", null, constraints, null);

            //1ª tabela
            cabecalho2.push(dataset.values[0].matricula); 
            cabecalho2.push(dataset.values[0].name_func); 
            cabecalho2.push(dataset.values[0].empresa); 
            cabecalho2.push(dataset.values[0].funcao); 
            cabecalho2.push(dataset.values[0].cpf); 
            cabecalho2.push(dataset.values[0].rg); 
            cabecalho2.push(dataset.values[0].ctps); 
            cabecalho2.push(dataset.values[0].hrs_trab); 

            var rowHead = table.insertRow(clickCR);
            clickCR++;
            
            for (var x = 0; x < 8; x++) {
                headCell = rowHead.insertCell(x);
                headCell.innerHTML = cabecalho2[x];
            }

            //1ª tabela
            cabecalho3.push("<b>Data</b>"); 
            cabecalho3.push("<b>Dia da Semana</b>"); 
            cabecalho3.push("<b>Entrada</b>"); 
            cabecalho3.push("<b>Intervalo</b>"); 
            cabecalho3.push("<b>Retorno</b>"); 
            cabecalho3.push("<b>Saída</b>"); 
            cabecalho3.push("<b>Hora Extra</b>"); 
            cabecalho3.push("<b>Horas Trabalhadas</b>");  

            var rowHead = table.insertRow(clickCR);
            
            for (var x = 0; x < 8; x++) {
                headCell = rowHead.insertCell(x);
                headCell.innerHTML = cabecalho3[x];
            }

            for (var i = 1; i <= maxDia; i++) {

                clickCR++;
                var aTb = [];
                var table = document.getElementById("tb_all");
                

                if(i < 10) {
                    i = '0'+i;
                }

                var fDate = i+'/'+mes+'/'+ano; 
                var fDate2 = ano+'-'+mes+'-'+i;
                var c1 = DatasetFactory.createConstraint("matricula", matricula, matricula, ConstraintType.MUST); 
                var c2 = DatasetFactory.createConstraint("date_log", fDate, fDate, ConstraintType.SHOULD);
                var c3 = DatasetFactory.createConstraint("date_log", fDate2, fDate2, ConstraintType.SHOULD);
                var constraints = new Array(c1, c2, c3);
                var dataset = DatasetFactory.getDataset("DSFormulariodeRegistrodeHorasTrabalhadas", null, constraints, null);
                var horaExtra = DatasetFactory.getDataset("DSFormulariodeHoraExtra", null, constraints, null);

                var valid = dataset.values.length;
                var valid2 = horaExtra.values.length;

                if (valid > 0) {
                    
                    var tbdia = dataset.values[0].day_log;
                    var tbentra = dataset.values[0].entrada_log;
                    var tbinterv = dataset.values[0].intervaloS_log;
                    var tbreturn = dataset.values[0].retorno_log;
                    var tbsaida = dataset.values[0].saida_log;
                    if(valid2 > 0) {
                        var tbhe = horaExtra.values[0].he;
                    } else {
                        var tbhe = "00:00"
                    }
                    
                } else {
                    
                    var semana = new Date(ano, parseInt(mes)-1, i);
                    semana = semana.getDay();
                    var tbdia = dSemana[semana];

                    if (semana == 0 || semana == 6) {
                        var tbentra = 'DSR'
                        var tbinterv = 'DSR'
                        var tbreturn = 'DSR'
                        var tbsaida = 'DSR'
                    } else {
                        var tbentra = ""
                        var tbinterv = ""
                        var tbreturn = ""
                        var tbsaida = ""
                    }
                    if(valid2 > 0) {
                        var tbhe = horaExtra.values[0].he;
                    } else {
                        var tbhe = "00:00"
                    }
                }

                if (tbentra != 'DSR' && tbentra != "") {

                    var h1 = tbentra.substring(0, 2);
                    var m1 = tbentra.substring(3, 5);
                    var h2 = tbinterv.substring(0, 2);
                    var m2 = tbinterv.substring(3, 5);
                    var h3 = tbreturn.substring(0, 2);
                    var m3 = tbreturn.substring(3, 5);
                    var h4 = tbsaida.substring(0, 2);
                    var m4 = tbsaida.substring(3, 5);

                    var mt1 = (parseInt(h1) * 60) + parseInt(m1);
                    var mt2 = (parseInt(h2) * 60) + parseInt(m2);
                    var mt3 = (parseInt(h3) * 60) + parseInt(m3);
                    var mt4 = (parseInt(h4) * 60) + parseInt(m4);


                    var mt = ((mt2 - mt1) + (mt4 - mt3))/60;

                    if (mt > 9) {
                        var h = mt.toString().substring(0, 2);
                    } else {
                        var h = mt.toString().substring(0, 1);
                    }

                    var minInd = mt - parseInt(h);

                    if (minInd != 0) {
                        var min = (minInd * 60).toFixed(0);
                        if (min < 10) {
                            min = "0"+min;
                        }
                    } else {
                        var min = "00"
                    }

                    if (parseInt(h) < 10) {
                        h = "0"+h;
                    }

                } else {
                    var h = '00';
                    var min = '00';
                }

                var hrs = h+":"+min;

                aTb.push(fDate);
                aTb.push(tbdia);
                aTb.push(tbentra);
                aTb.push(tbinterv);
                aTb.push(tbreturn);
                aTb.push(tbsaida);
                aTb.push(tbhe);
                aTb.push(hrs);
                
                var numOfRows4 = table.rows.length; 
                var newRow = table.insertRow(numOfRows4);
                
                for (var y = 0; y < 8; y++) {
                    
                    newCell = newRow.insertCell(y);
                    newCell.innerHTML = aTb[y];
                }

                th = parseInt(hrs.substring(0, 2)) + th;
                tmin = parseInt(hrs.substring(3, 5)) + tmin;

            }

        }
        
        var thrs = ((th*60)+tmin)/60;

        if (thrs > 99) {
            var tth = thrs.toString().substring(0, 3);
        } else if (thrs > 9){
            var tth = thrs.toString().substring(0, 2);
        } else {
            var tth = thrs.toString().substring(0, 1);
        }

        var indice = thrs - parseInt(tth);

        if (indice != 0) {
            var ttmin = (indice * 60).toFixed(0);
        } else {
            var ttmin = 0;
        }

        if (tth < 10) {
            tth = '0'+tth;
        }
        if (ttmin < 10) {
            ttmin = '0'+ttmin;
        }

        errorValid = 0;

    } else {
        errorValid = 1;
    }

};


function filterAvenced() {

    var de = $("#de").val();
    var ate = $("#ate").val();
    var dSemana = ['Domingo', 'Segunda-Ferira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
    var th = 0;
    var tmin = 0;
    var clickCR = 0;

    if ( de != "" && ate != "") {
        
        var tbBase = DatasetFactory.getDataset("DSFormulariodeCadastrodeFuncionario", null, null, null);
        var nDataset = tbBase.values.length;

        for (var z = 0; z < nDataset; z++) {

            var matricula = tbBase.values[z].matricula;

            var m = parseInt(de.substring(5, 7));
            var maxMes = parseInt(ate.substring(5, 7));
            var i = parseInt(de.substring(8, 10));
            var maxDia = parseInt(ate.substring(8, 10));
            var ano = (new Date()).getFullYear();
            var validy = 0;

            for (; m <= maxMes; m++) {

                if (m != maxMes) {
                    maxDia = (new Date (ano, m, 0)).getDate();
                    var nextM = 1;
                } else {
                    maxDia = parseInt(ate.substring(8, 10));
                    if (nextM == 1) {
                        i = 1;
                    }
                }

                if (m < 10) {
                    m = '0'+m;
                }
                for(; i <= maxDia; i++) {

                    if (i < 10) {
                        i = '0'+i;
                    }

                    var fDate = i+'/'+m+'/'+ano; 
                    var fDate2 = ano+'-'+m+'-'+i;

                    
                    var y1 = DatasetFactory.createConstraint("matricula", matricula, matricula, ConstraintType.MUST); 
                    var y2 = DatasetFactory.createConstraint("date_log", fDate, fDate, ConstraintType.SHOULD);
                    var y3 = DatasetFactory.createConstraint("date_log", fDate2, fDate2, ConstraintType.SHOULD);
                    var constraintys = new Array(y1, y2, y3);
                    var dataset = DatasetFactory.getDataset("DSFormulariodeRegistrodeHorasTrabalhadas", null, constraintys, null);
                    if (dataset.values.length > 0) {
                        validy++;
                    }

                }
            }

            console.log('Validação');
            console.log(validy);
            console.log('-----');

            if (validy > 0) {

                var cabecalho = [];
                var cabecalho2 = [];
                var cabecalho3 = [];
                var table = document.getElementById("tb_all");
                
                
                //1ª tabela
                cabecalho.push("<b>Matricula</b>"); 
                cabecalho.push("<b>Nome</b>"); 
                cabecalho.push("<b>Empresa</b>"); 
                cabecalho.push("<b>Função</b>"); 
                cabecalho.push("<b>CPF</b>"); 
                cabecalho.push("<b>RG</b>"); 
                cabecalho.push("<b>Nº CTPS</b>");
                cabecalho.push("<b>Horário Padrão</b>"); 

                var rowHead = table.insertRow(clickCR);
                clickCR++;
                
                for (var x = 0; x < 8; x++) {
                    headCell = rowHead.insertCell(x);
                    headCell.innerHTML = cabecalho[x];
                }

                var c1 = DatasetFactory.createConstraint("matricula", matricula, matricula, ConstraintType.MUST); 
                var constraints = new Array(c1);
                var dataset = DatasetFactory.getDataset("DSFormulariodeCadastrodeFuncionario", null, constraints, null);

                //1ª tabela
                cabecalho2.push(dataset.values[0].matricula); 
                cabecalho2.push(dataset.values[0].name_func); 
                cabecalho2.push(dataset.values[0].empresa); 
                cabecalho2.push(dataset.values[0].funcao); 
                cabecalho2.push(dataset.values[0].cpf); 
                cabecalho2.push(dataset.values[0].rg); 
                cabecalho2.push(dataset.values[0].ctps); 
                cabecalho2.push(dataset.values[0].hrs_trab); 

                var rowHead = table.insertRow(clickCR);
                clickCR++;
                
                for (var x = 0; x < 8; x++) {
                    headCell = rowHead.insertCell(x);
                    headCell.innerHTML = cabecalho2[x];
                }

                //1ª tabela
                cabecalho3.push("<b>Data</b>"); 
                cabecalho3.push("<b>Dia da Semana</b>"); 
                cabecalho3.push("<b>Entrada</b>"); 
                cabecalho3.push("<b>Intervalo</b>"); 
                cabecalho3.push("<b>Retorno</b>"); 
                cabecalho3.push("<b>Saída</b>"); 
                cabecalho3.push("<b>Hora Extra</b>"); 
                cabecalho3.push("<b>Horas Trabalhadas</b>");  

                var rowHead = table.insertRow(clickCR);
                
                for (var x = 0; x < 8; x++) {
                    headCell = rowHead.insertCell(x);
                    headCell.innerHTML = cabecalho3[x];
                }

                var m_2 = parseInt(de.substring(5, 7));
                var maxMes_2 = parseInt(ate.substring(5, 7));
                var i_2 = parseInt(de.substring(8, 10));
                var maxDia_2 = parseInt(ate.substring(8, 10));
                var ano_2 = (new Date()).getFullYear();

                for (; m_2 <= maxMes_2; m_2++) {

                    if (m_2 != maxMes_2) {
                        maxDia_2 = (new Date (ano, m_2, 0)).getDate();
                        var nextM = 1;
                    } else {
                        maxDia_2 = parseInt(ate.substring(8, 10));
                        if (nextM == 1) {
                            i_2 = 1;
                        }
                    }
                    if (m_2 < 10) {
                        m_2 = '0'+m_2;
                    }

                    for (; i_2 <= maxDia_2; i_2++) {

                        clickCR++;
                        var aTb = [];
                        var table = document.getElementById("tb_all");
                        
                        if(i_2 < 10) {
                            i_2 = '0'+i_2;
                        }

                        var dateParm1 = i_2+'/'+m_2+'/'+ano_2; 
                        var dateParm2 = ano_2+'-'+m_2+'-'+i_2;

                        var c1 = DatasetFactory.createConstraint("matricula", matricula, matricula, ConstraintType.MUST); 
                        var c2 = DatasetFactory.createConstraint("date_log", dateParm1, dateParm1, ConstraintType.SHOULD);
                        var c3 = DatasetFactory.createConstraint("date_log", dateParm2, dateParm2, ConstraintType.SHOULD);
                        var constraints = new Array(c1, c2, c3);
                        var dataset = DatasetFactory.getDataset("DSFormulariodeRegistrodeHorasTrabalhadas", null, constraints, null);
                        var horaExtra = DatasetFactory.getDataset("DSFormulariodeHoraExtra", null, constraints, null);

                        var valid = dataset.values.length;
                        var valid2 = horaExtra.values.length;

                        if (valid > 0) {

                            var semana = new Date(ano, m_2, i_2);
                            semana = semana.getDay();
                            var tbdia = dSemana[semana];

                            var tbentra = dataset.values[0].entrada_log;
                            var tbinterv = dataset.values[0].intervaloS_log;
                            var tbreturn = dataset.values[0].retorno_log;
                            var tbsaida = dataset.values[0].saida_log;
                            if(valid2 > 0) {
                                var tbhe = horaExtra.values[0].he;
                            } else {
                                var tbhe = "00:00"
                            }
                            
                        } else {
                            
                            var semana = new Date(ano, parseInt(m_2)-1, parseInt(i_2));
                            semana = semana.getDay();
                            var tbdia = dSemana[semana];

                            if (semana == 0 || semana == 6) {
                                var tbentra = 'DSR'
                                var tbinterv = 'DSR'
                                var tbreturn = 'DSR'
                                var tbsaida = 'DSR'
                            } else {
                                var tbentra = ""
                                var tbinterv = ""
                                var tbreturn = ""
                                var tbsaida = ""
                            }
                            if(valid2 > 0) {
                                var tbhe = horaExtra.values[0].he;
                            } else {
                                var tbhe = "00:00"
                            }

                        }

                        if (tbentra != 'DSR' && tbentra != "") {

                            var h1 = tbentra.substring(0, 2);
                            var m1 = tbentra.substring(3, 5);
                            var h2 = tbinterv.substring(0, 2);
                            var m2 = tbinterv.substring(3, 5);
                            var h3 = tbreturn.substring(0, 2);
                            var m3 = tbreturn.substring(3, 5);
                            var h4 = tbsaida.substring(0, 2);
                            var m4 = tbsaida.substring(3, 5);

                            var mt1 = (parseInt(h1) * 60) + parseInt(m1);
                            var mt2 = (parseInt(h2) * 60) + parseInt(m2);
                            var mt3 = (parseInt(h3) * 60) + parseInt(m3);
                            var mt4 = (parseInt(h4) * 60) + parseInt(m4);


                            var mt = ((mt2 - mt1) + (mt4 - mt3))/60;

                            if (mt > 9) {
                                var h = mt.toString().substring(0, 2);
                            } else {
                                var h = mt.toString().substring(0, 1);
                            }

                            var minInd = mt - parseInt(h);

                            if (minInd != 0) {
                                var min = (minInd * 60).toFixed(0);
                                if (min < 10) {
                                    min = "0"+min;
                                }
                            } else {
                                var min = "00"
                            }

                            if (parseInt(h) < 10) {
                                h = "0"+h;
                            }

                        } else {
                            var h = '00';
                            var min = '00';
                        }

                        var hrs = h+":"+min;
                        
                        aTb.push(dateParm1);
                        aTb.push(tbdia);
                        aTb.push(tbentra);
                        aTb.push(tbinterv);
                        aTb.push(tbreturn);
                        aTb.push(tbsaida);
                        aTb.push(tbhe);
                        aTb.push(hrs);
                        
                        var numOfRows4 = table.rows.length; 
                        var newRow = table.insertRow(numOfRows4);

                        clickCR = numOfRows4 +1;
                        
                        for (var y = 0; y < 8; y++) {
                            
                            newCell = newRow.insertCell(y);
                            newCell.innerHTML = aTb[y];
                        }

                        th = parseInt(hrs.substring(0, 2)) + th;
                        tmin = parseInt(hrs.substring(3, 5)) + tmin;

                    }
                }
            }

        }
        
        var thrs = ((th*60)+tmin)/60;

        if (thrs > 99) {
            var tth = thrs.toString().substring(0, 3);
        } else if (thrs > 9){
            var tth = thrs.toString().substring(0, 2);
        } else {
            var tth = thrs.toString().substring(0, 1);
        }

        var indice = thrs - parseInt(tth);

        if (indice != 0) {
            var ttmin = (indice * 60).toFixed(0);
        } else {
            var ttmin = 0;
        }

        if (tth < 10) {
            tth = '0'+tth;
        }
        if (ttmin < 10) {
            ttmin = '0'+ttmin;
        }

        errorValid = 0;

    } else {
        errorValid = 1;
    }

};

function fullreport () {

    if (av == 0) {

        $('#loading').removeClass('nav-close');

        setTimeout(function() {
            allFunc();
        },120);

        if (errorValid == 0) {
            setTimeout(function() {
                $("#loading").addClass('nav-close');
                $('#solict').addClass('nav-close');
                $('#pdfGeral').removeClass('nav-close');
            },1000);
        } else {
            $("#loading").addClass('nav-close');
            window.location.reload(true);
        }
    } else {
        $('#loading').removeClass('nav-close');

        setTimeout(function() {
            filterAvenced();
        },120);

        if (errorValid == 0) {
            setTimeout(function() {
                $("#loading").addClass('nav-close');
                $('#solict').addClass('nav-close');
                $('#pdfGeral').removeClass('nav-close');
            },1000);
        } else {
            $("#loading").addClass('nav-close');
            window.location.reload(true);
        }
    }

};

function btnAvenced() {
    $('#btnAv').addClass('nav-close');
    $('#filter3').addClass('nav-close');
    $('#filter2').addClass('nav-close');
    $('#filter1').addClass('nav-close');
    $('#avenced').removeClass('nav-close');
    $('#btnBack').removeClass('nav-close');
    av=1;
}

function voltar() {
    $('#btnAv').removeClass('nav-close');
    $('#filter3').removeClass('nav-close');
    $('#filter2').removeClass('nav-close');
    $('#filter1').removeClass('nav-close');
    $('#avenced').addClass('nav-close');
    $('#btnBack').addClass('nav-close');
    av=0
}
