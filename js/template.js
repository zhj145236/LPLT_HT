// 图片上传封装函数
// showId，imgShow图片展示
// inpId，inp图片上传input组件id
function uploadImg(inpId,showId,lenNum){
	let inp=document.getElementById(inpId),imgShow = document.getElementById(showId),clear = '删除',li,imgArr = [];
	// 当用户上传时触发事件
	inp.onchange=function(){
		readFile(this);
		imgArr.push(inp.files[0]);
		// console.log(inp.files[0]);
	}
	//处理图片并添加都dom中的函数
	let readFile=function(obj){
		// 获取input里面的文件组
		let fileList=obj.files;
		//对文件组进行遍历，可以到控制台打印出fileList去看看
		for(let i=0;i<fileList.length;i++){
			let reader= new FileReader();
			reader.readAsDataURL(fileList[i]);
			 // 当文件读取成功时执行的函数
			reader.onload=function(e){
				let li=document.createElement('li');
				li.setAttribute("class", "newLi");
				li.innerHTML='<img src="'+this.result+'" />'+'<div class="uploadFather"><p class="clearImageProduct newP">'+clear+'</p><p class="imgUpload">上传</p></div>';
				imgShow.appendChild(li);
				
				
				// 删除图片 待改进后期处理
				// newP删除按钮，newLiTag该删除按钮对应的数据
				// imgShowTag获取创建的li标签的数量	
				let newP = document.getElementsByClassName('newP'),
				newLiList = imgShow.childNodes,
				newLiTag = document.getElementsByClassName('newLi'),
				imgShowTag = imgShow.getElementsByTagName('li').length;
				
				// 计算上传图片的数量
				if(imgShowTag == lenNum){
					inp.setAttribute("disabled","disabled");
					alert('图片上传不能超过' + lenNum + '张');
				}
				
				for(let j=0;j<newLiList.length;j++){
					(function(j){
						newLiList[j].lastElementChild.firstElementChild.onclick = function(){
							this.parentElement.parentElement.remove();
							// console.log(j,'对应下标');
							if(newLiList.length == 0){
								inp.disabled="";
							}
						}
						newLiList[j].lastElementChild.lastElementChild.onclick = function(){
							let getUploadNeedUrl = "",
							getUrlName = "",
							fileSize = "",
							fileNameData = newLiList[j].firstElementChild.src;
							for(let m=0;m<imgArr.length;m++){
								let needSrc = imgArr[j].name,needSize = imgArr[j].size/1024;
								urlName = needSrc.split('.');
								getUploadNeedUrl = needSrc;
								getUrlName = urlName;
								fileSize = needSize;
							}
							
							// 多张图片上传
							function dataURLtoFile(dataurl, filenames) { //将base64转换为文件
								var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
								bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
								while(n--){
									u8arr[n] = bstr.charCodeAt(n);  
								}  
								return new File([u8arr], filenames, {type:mime});  
							}
							function fileup() {
									let	form=document.forms[0],
									formData = new FormData();
									formData.append("file",dataURLtoFile(fileNameData,getUploadNeedUrl));
									formData.append("names",getUrlName[0]);
								// 判断图片是否小于1M,如果小于则直接上传否则进行压缩处理
								if(fileSize > 1025){
									alert('上传失败,请压缩到1M以内上传');
								}else{
									$.ajax({
										// 线上服务器ip
										// url: 'http://45.248.70.26:8888/yoga/api/file/uploadFile',
										// 开发人员ip
										 url: 'http://192.168.31.174:8888/yoga/api/file/uploadFile',
										 type: 'POST',   
										 data: formData,
										 async: false,
										 cache: false,
										 contentType: false,   // 告诉jQuery不要去设置Content-Type请求头  
										 processData: false,   // 告诉jQuery不要去处理发送的数据
										 success: function (returndata) {
											if(returndata.code == 200){
												newLiList[j].lastElementChild.lastElementChild.innerText = '上传成功';
												newLiList[j].lastElementChild.lastElementChild.onclick = null; // 图片上传成功后随即清除点击事件
											}
											console.log(returndata);
											// 线上服务器ip
											// newLiList[j].firstElementChild.src = 'http://45.248.70.26:8888/yoga' + returndata.map.viewUrl;	
											// 开发人员ip
											newLiList[j].firstElementChild.src = 'http://192.168.31.174:8888/yoga' + returndata.map.viewUrl;									
										 },   
										 error: function (returndata) {
										   alert(returndata);   
										 }
									});
								}
								
							}
							fileup();
						};								
					})(j);
				}
			}
		}
	}
}

// ios微信自带浏览器软件盘弹起将页面顶上去后无法正常复位问题
function keyboardEvents() {
			let myFunction;
			document.body.addEventListener('focusin', () => { // 软键盘弹起事件
				clearTimeout(myFunction)
			})
			document.body.addEventListener('focusout', () => { // 软键盘关闭事件
				clearTimeout(myFunction)
				myFunction = setTimeout(function () {
					window.scrollTo({
						top: 0,
						left: 0,
						behavior: 'smooth'
					}) // =======当键盘收起的时候让页面回到原始位置
				}, 200)
			})
		}
