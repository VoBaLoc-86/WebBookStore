var themvaogiohang = []; // Định nghĩa biến themvaogiohang ở phạm vi toàn cục

function giohang(productId) {
    var productDiv = document.getElementById(productId); 
    var imgBook = productDiv.querySelector('img');
    var imgBookSrc = imgBook.getAttribute('src'); 
    var DescribeDiv = productDiv.querySelector('.describe');
    var nameBook = DescribeDiv.querySelector('p').querySelector('strong').textContent;
    var money = productDiv.querySelector('.info').querySelector('.muahang .price span').textContent;

    // Kiểm tra xem liệu có dữ liệu cũ trong session storage không
    var gh = sessionStorage.getItem("themvaogiohang");
    if (gh) {
        // Nếu có, lấy dữ liệu cũ ra và chuyển về mảng
        themvaogiohang = JSON.parse(gh);
    } else {
        // Nếu không, khởi tạo một mảng mới
        themvaogiohang = [];
    }

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    var existingProductIndex = themvaogiohang.findIndex(item => item[1] === nameBook);
    if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, không làm gì cả vì đã được xử lý trong hàm thanhtien
    } else {
        // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
        var infoHang = [imgBookSrc, nameBook, money, 1]; // Số lượng mặc định là 1
        themvaogiohang.push(infoHang);
    }

    // Lưu dữ liệu mới vào session storage
    sessionStorage.setItem("themvaogiohang", JSON.stringify(themvaogiohang));
}



function showMycart() {
    var gh = sessionStorage.getItem("themvaogiohang");
    themvaogiohang = JSON.parse(gh); // Gán lại giá trị cho biến themvaogiohang
    var ttgh = "";
    var tongTatCa = 0;
    for (let i = 0; i < themvaogiohang.length; i++) {
        var price = parseInt(themvaogiohang[i][2].replace(/\D/g, '')); // Lấy giá tiền của sản phẩm và loại bỏ ký tự không phải là số
        var quantity = 1; // Số lượng mặc định
        var total = quantity * price; // Tính tổng thành tiền
        var totalPriceId = 'priceProduct_' + i; // Định danh duy nhất cho tổng tiền của sản phẩm
        ttgh += '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td><img src="' + themvaogiohang[i][0] + '" alt=""></td>' +
            '<td>' + themvaogiohang[i][1] + '</td>' +
            '<th><span>' + themvaogiohang[i][2] + '</span> VNĐ</th>' +
            '<td>'+
                '<input type="number" id="quantity_' + i + '" max="10" min="1" value="1" step="1" onchange="updateCartItem(this, ' + i + ')">'+
            '</td>'+
            '<td>'+
                '<span id="' + totalPriceId + '">' + total + '</span> VNĐ' +
            '</td>'+
            '<td>'+
                '<button onclick="xoasp(this)">Xóa</button>' +
            '</td>'+
            '</tr>';
        tongTatCa += total; // Cập nhật tổng giá trị của tất cả sản phẩm
    }
    ttgh+='<tr>'+
    '<th colspan="5">Tổng Tiền</th>'+
    '<th id="tongTatCa">'+tongTatCa+'</th>'+ // Đặt id cho phần tổng tiền để dễ dàng cập nhật giá trị sau này
    '</tr>';
    document.getElementById('mycart').innerHTML = ttgh;
}

function updateCartItem(input, index) {
    thanhtien(input, index);
    totalMoney();
}

function thanhtien(Price, index){
    var quantityInput = Price.value; // Lấy giá trị số lượng từ input
    var productRow = Price.parentElement.parentElement; // Lấy hàng chứa sản phẩm
    var priceSpan = productRow.querySelector('th span'); // Lấy thẻ span chứa giá tiền
    var price = parseInt(priceSpan.textContent.replace(/\D/g, '')); // Lấy giá tiền của sản phẩm và loại bỏ ký tự không phải là số
    var total = quantityInput * price; // Tính tổng thành tiền
    var totalPriceId = 'priceProduct_' + index; // Định danh duy nhất cho tổng tiền của sản phẩm
    document.getElementById(totalPriceId).innerHTML = total; // Cập nhật tổng tiền của sản phẩm
    
    // Gọi hàm tính tổng tiền của tất cả sản phẩm lại
    totalMoney();
}

function totalMoney() {
    var tongTatCa = 0;
    for (let i = 0; i < themvaogiohang.length; i++) {
        var priceItem = parseInt(themvaogiohang[i][2].replace(/\D/g, '')); // Lấy giá tiền của sản phẩm
        var quantityItem = parseInt(document.getElementById('quantity_' + i).value); // Lấy số lượng của sản phẩm từ input
        tongTatCa += priceItem * quantityItem; // Cập nhật tổng giá trị của tất cả sản phẩm
    }
    document.getElementById('tongTatCa').innerHTML = tongTatCa + ' VNĐ'; // Cập nhật tổng thành tiền
}

function xoasp(x){
    var tr=x.parentElement.parentElement;
    var tensp = tr.children[2].innerText;
    tr.remove();
    for (let i = 0; i < themvaogiohang.length; i++) {
        if (themvaogiohang[i][1] === tensp) {
            themvaogiohang.splice(i,1);
        }
    }
    sessionStorage.setItem("themvaogiohang", JSON.stringify(themvaogiohang));
    showMycart();
    totalMoney();
}
function xoatatca() {
    // Gán lại giá trị cho biến themvaogiohang
    themvaogiohang = []; // Khởi tạo mảng mới

    // Lưu mảng rỗng vào sessionStorage để xóa tất cả sản phẩm trong giỏ hàng
    sessionStorage.setItem("themvaogiohang", JSON.stringify(themvaogiohang));
    
    // Cập nhật lại giỏ hàng và tổng tiền
    showMycart();
    totalMoney();
}


