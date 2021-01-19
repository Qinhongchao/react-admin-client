import React, { Component } from "react";
import { Card, Icon, Form, Input, Cascader, Button, message } from "antd";
import RichTextEditor from "./rich-text-editor";
import { reqCategorys, reqAddOrUpdateProduct } from "../../api";
import PicturesWall from "./pictures-wall";

const { Item } = Form;
const { TextArea } = Input;

class AddUpdate extends Component {
  state = {
    options: [],
  };

  constructor(props) {
    super(props);

    this.pw = React.createRef();
    this.editor = React.createRef();
  }

  componentWillMount() {
    const {product} = this.props.location.state;
    this.isUpdate = !!product;
    this.product = product || {};
  }

  componentDidMount() {
    this.getCategorys("0");
  }

  getCategorys = async (parentId) => {

    let result = await reqCategorys(parentId);
    if (result.status === 0) {
      if (parentId === "0") {
        this.initOptions(result.data);
      } else {
        return result.data;
      }
    } else {
      message.error("获取商品分类数据失败");
    }
  };

  initOptions = async (categorys) => {
    // 根据categorys生成options数组
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }));

    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this;
  
    const  {pCategoryId}  = product;

    if (isUpdate && pCategoryId !== "0") {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(
        (option) => option.value === pCategoryId
      );
     

      // 关联对应的一级option上
      targetOption.children = childOptions;

    }

    // 更新options状态
    this.setState({
      options,
    });
  };

  submit = () => {
    this.props.form.validateFields(async (error, values) => {
      const { name, desc, price, categoryIds } = values;
      const imgs = this.pw.current.getImgs();
      const detail = this.editor.current.getDetail();
      let pCategoryId, categoryId;
      if (categoryIds.length === 1) {
        pCategoryId = "0";
        categoryId = categoryIds[0];
      } else {
        pCategoryId = categoryIds[0];
        categoryId = categoryIds[1];
      }
      const product = {
        name,
        desc,
        price,
        imgs,
        detail,
        pCategoryId,
        categoryId,
      };

       // 如果是更新, 需要添加_id
       if(this.isUpdate) {
        product._id = this.product._id
      }

      const result = await reqAddOrUpdateProduct(product);

      // 3. 根据结果提示
      if (result.status === 0) {
        message.success(`${this.isUpdate ? "更新" : "添加"}商品成功!`);
        this.props.history.goBack();
      } else {
        message.error(`${this.isUpdate ? "更新" : "添加"}商品失败!`);
      }
    });
  };

  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback();
    } else {
      callback("价格必须大于0");
    }
  };

  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;
    const subcategorys = await this.getCategorys(targetOption.value);
    // 隐藏loading
    targetOption.loading = false;
    if (subcategorys && subcategorys.length > 0) {
      const childOptions = subcategorys.map((item) => {
        return {
          value: item._id,
          label: item.name,
          isLeaf: true,
        };
      });
      targetOption.children = childOptions;
    } else {
      targetOption.isLeaf = true;
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options],
    });
  };

  render() {
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 2 }, // 左侧label的宽度
      wrapperCol: { span: 8 }, // 右侧包裹的宽度
    };
    const { product, isUpdate } = this;

    const { getFieldDecorator } = this.props.form;

    const {pCategoryId, categoryId, imgs, detail} = product

    const categoryIds = []
    if(isUpdate) {
      // 商品是一个一级分类的商品
      if(pCategoryId==='0') {
        categoryIds.push(categoryId)
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    return (
      <Card>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {getFieldDecorator("name", {
              initialValue: product.name,
              rules: [{ required: true, message: "必须输入商品名称" }],
            })(<Input placeholder="请输入商品名称" />)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator("desc", {
              initialValue: product.desc,
              rules: [{ required: true, message: "必须输入商品描述" }],
            })(<TextArea placeholder="请输入商品描述" />)}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator("price", {
              initialValue: product.price,
              rules: [
                { required: true, message: "必须输入商品价格" },
                { validator: this.validatePrice },
              ],
            })(
              <Input
                type="number"
                placeholder="请输入商品价格"
                addonAfter="元"
              />
            )}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator("categoryIds", {
              initialValue: categoryIds,
              rules: [{ required: true, message: "必须输入商品分类" }],
            })(
              <Cascader options={this.state.options} loadData={this.loadData} />
            )}
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={product.imgs} />
          </Item>
          <Item
            label="商品详情"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            <RichTextEditor ref={this.editor} detail={product.detail} />
          </Item>
          <Item>
            <Button type="primary" onClick={this.submit}>
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(AddUpdate);
