/**********************************
            Public部分
 **********************************/
var ClearDiv = React.createClass({
    render: function(){
        return (
            <div className="clear"></div>
            );
    }
});

/**********************************
            HeadNav部分
 **********************************/
var HeadNav = React.createClass({
    render: function(){
        return (
            <div className="header-nav">
                <HeadNavLogoFont firLogoName="Data Analysis" secLogoName="ShowJoy"/>
                <HeadUser imgPath="img/public-head-img.png" userName="user name"/>
                <ClearDiv/>
            </div>
            );
    }
});

var HeadNavLogoFont = React.createClass({
    render: function(){
        return (
            <div className='header-logo'>
                <span className='header-logo-fir'>{this.props.firLogoName}</span>
                <span className='header-logo-sec'>{this.props.secLogoName}</span>
            </div>
            );
    }
});

var HeadUser = React.createClass({
    render: function(){
        return (
            <div className='header-user'>
                <div className='header-user-ori'>
                    <img src={this.props.imgPath}/>
                    <span>{this.props.userName}</span>
                </div>
                <div className='header-user-hover j_header-user-hover'>退出</div>
            </div>
            );
    }
});

React.render(
    <HeadNav/>,
    $('#header')[0]
);

/**********************************
            Wrapper部分
 **********************************/
var WrapperContent = React.createClass({
    render: function(){
        return (
            <div className="wrapper-content">
                <WrapperNav />
                <WrapperMain mainTitle='渠道效果监控'/>
                <ClearDiv/>
            </div>
            );
    }
});

/**********************************
            WrapperNav部分
 **********************************/
var WrapperNav = React.createClass({
    render: function(){
        return (
            <div className='wrapper-nav'>
                <ul>
                    <WrapperNavList isActive='active' listUrl='#' listName='渠道效果监控'/>
                    <WrapperNavList isActive='' listUrl='#' listName='商品受访数据监控'/>
                    <WrapperNavList isActive='' listUrl='#' listName='受访页面分析'/>
                    <WrapperNavList isActive='' listUrl='#' listName='搜索记录监控'/>
                    <WrapperNavList isActive='' listUrl='#' listName='会员信息监控'/>
                </ul>
            </div>
            );
    }
});

var WrapperNavList = React.createClass({
    render: function(){
        return (
            <li className={this.props.isActive}><a href={this.props.listUrl}>{this.props.listName}</a></li>
            );
    }
});

/**********************************
            WrapperMain部分
 **********************************/
var WrapperMain = React.createClass({
    render: function(){
        return (
            <div className='wrapper-main'>
                <div className="wrapper-main-title">{this.props.mainTitle}</div>
                <WrapperMainTopNav />
            </div>
            );
    }
});

//这个方法这里引用了之前的一个组件，可以表现出相应的好处
var WrapperMainTopNav = React.createClass({
    render: function(){
        return (
            <div className='wrapper-main-nav'>
                <ul>
                    <WrapperNavList isActive='active' listUrl='#' listName='今天'/>
                    <WrapperNavList isActive='' listUrl='#' listName='昨天'/>
                    <WrapperNavList isActive='' listUrl='#' listName='最近7天'/>
                    <WrapperNavList isActive='' listUrl='#' listName='最近30天'/>
                </ul>
            </div>
            );
    }
});


React.render(
    <WrapperContent/>,
    $('#wrapper')[0]
);