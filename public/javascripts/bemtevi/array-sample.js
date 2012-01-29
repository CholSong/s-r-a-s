var families = [
	{
		id: 1,
		templates: [
			{
  			id: 1,
  			type: "detail", // indica summary ou detail
  			imageUrl: "http://bemtevi.com/template1",
				thumbUrl: "http://localhost/~allexrm/bemtevi/templates/thumbs/thumb-f1-t1.jpg",
  			baseColor: "#6b5f9c", // Cor do template
  			relatedTemplateId: 2, //Talves não seja mais necessário
				peerTemplateId: 5, //ID do template resumido
  			overlays: [
   				{
     				id: 1,
     				type: "text",
						format: { "width":"100%", "height":"150px", "background":"url(templates/f1t1-titulo.jpg) center top no-repeat", "border":"none solid 1px red" },
     				value: "title",
						valueFormat: { "font-size":"22px", "text-align":"center", "font-family":"Arial", "font-weight":"bold", "color":"#ffeedd" },
     				width: 100,
     				height: 26
    			},
					{
						id: 2,
						type: "image",
						format: { "width":"100%", "height":"200px", "border":"none solid 1px blue" },
						value: "http://localhost/bemtevi/temp/eiffel.jpg",
						valueFormat: { "left":"10px", "top":"10px", "width":"100px", "height":"100px" }
					},
   				{
     				id: 3,
     				type: "text",
						format: { "width":"50%", "height":"150px", "background":"url(templates/f1t1-rodape.jpg) center top no-repeat", "border":"none solid 1px red" },
     				value: "Texto do rodapé",
						valueFormat: { "font-size":"16px", "text-align":"left", "font-family":"Arial", "font-weight":"bold", "color":"#695f94" },
     				width: 100,
     				height: 26
    			},
					{
						id: 4,
						type: "image",
						format: { "width":"50%", "height":"150px", "border":"none solid 1px blue" },
						value: "http://localhost/bemtevi/temp/eiffel.jpg",
						valueFormat: { "left":"10px", "top":"10px", "width":"100px", "height":"100px" }
					},
				] // end overlays
			},
			{
  			id: 2,
  			type: "detail", // indica summary ou detail
  			imageUrl: "http://bemtevi.com/template2",
				thumbUrl: "http://localhost/~allexrm/bemtevi/templates/thumbs/thumb-f1-t1.jpg",
  			baseColor: "#ed7934", // Cor do template
  			relatedTemplateId: 2, //Talves não seja mais necessário
				peerTemplateId: 5, //ID do template resumido
  			overlays: [
   				{
     				id: 1,
     				type: "text",
						format: { "width":"100%", "height":"150px", "background":"url(templates/f1t2-titulo.jpg) center top no-repeat", "border":"none solid 1px red" },
     				value: "title",
						valueFormat: { "font-size":"22px", "text-align":"center", "font-family":"Arial", "font-weight":"bold", "color":"#ffeedd" },
     				width: 100,
     				height: 26
    			},
					{
						id: 2,
						type: "image",
						format: { "width":"100%", "height":"200px", "border":"none solid 1px blue" },
						value: "http://localhost/bemtevi/temp/eiffel.jpg",
						valueFormat: { "left":"10px", "top":"10px", "width":"100px", "height":"100px" }
					},
   				{
     				id: 3,
     				type: "text",
						format: { "width":"50%", "height":"150px", "background":"url(templates/f1t2-rodape.jpg) center top no-repeat", "border":"none solid 1px red" },
     				value: "Texto do rodapé",
						valueFormat: { "font-size":"16px", "text-align":"left", "font-family":"Arial", "font-weight":"bold", "color":"#695f94" },
     				width: 100,
     				height: 26
    			},
					{
						id: 4,
						type: "image",
						format: { "width":"50%", "height":"150px", "border":"none solid 1px blue" },
						value: "http://localhost/bemtevi/temp/eiffel.jpg",
						valueFormat: { "left":"10px", "top":"10px", "width":"100px", "height":"100px" }
					},
				] // end overlays
			},
			{
  			id: 3,
  			type: "detail", // indica summary ou detail
  			imageUrl: "http://bemtevi.com/template2",
				thumbUrl: "http://localhost/~allexrm/bemtevi/templates/thumbs/thumb-f1-t1.jpg",
  			baseColor: "#31ce52", // Cor do template
  			relatedTemplateId: 2, //Talves não seja mais necessário
				peerTemplateId: 5, //ID do template resumido
  			overlays: [
   				{
     				id: 1,
     				type: "text",
						format: { "width":"100%", "height":"150px", "background":"url(templates/f1t3-titulo.jpg) center top no-repeat", "border":"none solid 1px red" },
     				value: "title",
						valueFormat: { "font-size":"22px", "text-align":"center", "font-family":"Arial", "font-weight":"bold", "color":"#ffeedd" },
     				width: 100,
     				height: 26
    			},
					{
						id: 2,
						type: "image",
						format: { "width":"100%", "height":"200px", "border":"none solid 1px blue" },
						value: "http://localhost/bemtevi/temp/eiffel.jpg",
						valueFormat: { "left":"10px", "top":"10px", "width":"100px", "height":"100px" }
					},
   				{
     				id: 3,
     				type: "text",
						format: { "width":"50%", "height":"150px", "background":"url(templates/f1t3-rodape.jpg) center top no-repeat", "border":"none solid 1px red" },
     				value: "Texto do rodapé",
						valueFormat: { "font-size":"16px", "text-align":"left", "font-family":"Arial", "font-weight":"bold", "color":"#695f94" },
     				width: 100,
     				height: 26
    			},
					{
						id: 4,
						type: "image",
						format: { "width":"50%", "height":"150px", "border":"none solid 1px blue" },
						value: "http://localhost/bemtevi/temp/eiffel.jpg",
						valueFormat: { "left":"10px", "top":"10px", "width":"100px", "height":"100px" }
					},
				] // end overlays
			},
			
			
   ] // end templates
  }
] // end families