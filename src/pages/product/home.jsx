import React, { Component } from "react";
import { Card, Table, Select,Input,Button,Icon, message } from "antd";
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'
import {BASE_IMG_URL, PAGE_SIZE} from '../../utils/constants'
import LinkButton from '../../components/link-button'

const { Option } = Select;

export default class ProductHome extends Component {
  state = {
    products: [
      
    ],
    searchType:'productName',
    searchName:'',
    total:0
  };

  componentWillMount() {
    this.initColumns();
  }

  componentDidMount(){
    this.getProducts(1)
  }

  getProducts=async (pageNum)=>{

    this.pageNum = pageNum // 保存pageNum, 让其它方法可以看到

    const {searchName,searchType}=this.state
    let result
    if(searchName){

      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})

    }else{
      result = await reqProducts(pageNum,PAGE_SIZE)
   
    }

    if(result.status===0){
      const {list:products,total}=result.data
      this.setState({
        products,
        total
      })
    }else{
      message.error('查询商品失败')
    }

 

  }

  /*
  更新指定商品的状态
   */
  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if(result.status===0) {
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    }
  }

  initColumns = () => {
    this.columns =  this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          const {status, _id} = product
          const newStatus = status===1 ? 2 : 1
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status===1 ? '下架' : '上架'}
              </Button>
              <span>{status===1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              {/*将product对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate', {product})}>修改</LinkButton>
            </span>
          )
        }
      },
    ];
  };

  handleSearch=()=>{
    this.getProducts(1)
  }



  render() {
    const { products,searchName,searchType ,total} = this.state;
    const columns = this.columns;

    const title = (
      <span className='header'>
        <Select className="select" value={searchType} onChange={value=>this.setState({searchType:value})}>
          <Option key="productName">商品名称</Option>
          <Option key="productDesc">商品描述</Option>
        </Select>
        <Input  className="input" value={searchName} onChange={event=>{this.setState({searchName:event.target.value})}} />
        <Button type='primary' onClick={this.handleSearch}>搜索</Button>
      </span>
    );

    const extra = <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}><Icon type="plus" />添加商品</Button>;
    return (
      <Card title={title} extra={extra} className="product-home">
        <Table bordered columns={columns} dataSource={products} rowKey='_id'   pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts
          }}/>
      </Card>
    );
  }
}
