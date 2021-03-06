feather.config.merge({
	staticMode: true,	//开启静态资源内联模式
	autoCombine: true, 	//开启静态资源内联模式后，使用autocombine可自动合并页面上的零散资源

	md5Query: {
		open: true,
		name: 'version'
	},

	roadmap: {
		domain: ''
	},

    //设置产出
	deploy: {
		local: [
			{
				from: '/static/static',
	            //本地目录
	            to: '../feather-team.github.io/static',
	            include: /\/static\/.*/,
	            subOnly: true
			},
			{
	            from: '/view/page',
	            //本地目录
	            to: '../feather-team.github.io/',
	            include: /index\.html$/,
	            subOnly: true
	        },
	        {
	        	from: '/view/page',
	        	//本地目录
	            to: '../feather-team.github.io/page',
	            exclude: /index\.html$/,
	            subOnly: true
	        },
	        {
	        	from: '/view/pagelet',
	        	to: '../feather-team.github.io/pagelet',
	        	include: /\.html$/,
	        	subOnly: true
	        }
		]
	}
});
