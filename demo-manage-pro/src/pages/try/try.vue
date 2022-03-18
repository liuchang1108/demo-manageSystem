<template>
  <div class="levelVue">
    <!-- 表单查询 -->
    <div class="levelVue-form">
        <div>
             <el-form :inline="true" :model="searchMap" ref="searchForm" class="demo-form-inline">
        <el-form-item prop="jobNumber">
          <el-input
            v-model="searchMap.jobNumber"
            placeholder="请输入该员工工号"
          ></el-input>
        </el-form-item>
        <el-divider direction="vertical" class="levelVue-divider"></el-divider>
        <el-form-item prop="name">
          <el-input
            v-model="searchMap.name"
            placeholder="请输入该员工姓名"
          ></el-input>
        </el-form-item>
        <el-form-item class="levelVue-button">
          <el-button type="primary" @click="searchData" >查询</el-button>
           <el-button type="primary" @click="resetForm(searchForm)" class="levelVue-button__reset"
          >重置
        </el-button>
        </el-form-item>
      </el-form>
        </div>
     
    </div>
    <!-- 表格 -->
    <div class="levelVue-table">
      <el-table :data="formState.list" style="width: 100%" stripe>
        <el-table-column type="expand" class="levelVue-table__data">
          <template #default="props">
            <p>工号：{{ props.row.jobNumber }}</p>
            <p>部门：{{ roleFilter(props.row.department) }}</p>
            <p>导师：{{ props.row.mentor }}</p>
            <p>入职时间：{{ props.row.enterDate }}</p>
            <p>答辩时间：{{ props.row.testDate }}</p>
            <p>手机号码：{{ props.row.phoneNumber }}</p>
            <p>level：{{props.row.levelValue}}</p>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="评分" prop="levelValue" class="levelVue-table__score" ><template #default="scope">
            <span>{{ roleFilter2(scope.row.department) }}</span>
          </template></el-table-column>  
              <!-- <el-rate :colors="colors"  :texts="['out', 'out', 'pass', 'sp level', 'ssp level']"
    show-text size="small" ></el-rate> -->
     
      </el-table>
    </div>
    <div class="page-demo__paginationTool">
      <div class="page-demo__totalNumber">共{{ formState.total }}条数据</div>
      <div class="page-demo__pagination">
        <el-pagination
          small
          background
          layout="prev, pager, next"
          :total="formState.total"
          class="mt-4"
          :page-size="formState.pageSize"
          :page-sizes="[10, 15, 20]"
          :current-page="formState.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed, toRefs } from "vue";
import AppHeaderVue from "../../components/AppHeader/index.vue";
import studentApi from "../../api/student";
import { ElForm, ElMessage } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";

type FormInstance = InstanceType<typeof ElForm>;
const searchForm = ref<FormInstance>();
const studentForm = ref<FormInstance>();
export default defineComponent({
  name: "HelpVue",
  components: {
    AppHeaderVue,
  },
  setup() {
      const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900']) 
    const dialogTeacherVisible = ref(false);
    const isEdit = ref(false);
    const roleOptions = reactive([
      { type: "1", name: "技术部-前端平台" },
      { type: "2", name: "手机部-数据平台" },
      { type: "3", name: "技术部-仿真平台" },
      { type: "4", name: "研发部-算法平台" },
      { type: "5", name: "财务部-管理平台" },
      { type: "6", name: "市场部-销售平台" },
    ]);
    const roleOptions2 = reactive([
      { type: "1", template:`<el-rate v-model="roleOptions2.type" :colors="colors"  :texts="['out', 'out', 'pass', 'sp level', 'ssp level']"
    show-text size="small" ></el-rate>`},
      { type: "2", name: "手机部-数据平台" },
      { type: "3", name: "技术部-仿真平台" },
      { type: "4", name: "研发部-算法平台" },
      { type: "5", name: "财务部-管理平台" },
      { type: "6", name: "市场部-销售平台" },
    ]);
    const dialogFormVisible = ref(false);
    const formState = reactive({
      total: 0,
      currentPage: 1,
      pageSize: 10,
      list: [],
    });
    const searchMap = reactive({
      jobNumber: "",
      name: ""
    });
    const studentTable = ref({
      _id: null,
      jobNumber: "",
      name: "",
      department: "",
      mentor: "",
      enterDate: "",
      testDate: "",
      phoneNumber: "",
      mentorId: "",
      levelValue:""
    });
    const roleFilter = computed(() => {
      return function (type: string) {
        const obj = roleOptions.find(function (item) {
          if (item.type === type) {
            return item;
          }
        });
        return obj ? obj.name : null;
      };
    });
     const roleFilter2 = computed(() => {
      return function (type: string) {
        const obj = roleOptions2.find(function (item) {
          if (item.type === type) {
            return item;
          }
        });
        return obj ? obj.template : null;
      };
    });
    const searchData = () => {
      formState.currentPage = 1;
      fetchData();
    };
    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };
    const fetchData = () => {
      studentApi
        .search(formState.currentPage, formState.pageSize, searchMap)
        .then((response) => {
          const resp = response.data;
          formState.total = resp.data.total;
          formState.list = resp.data.rows;
        });
    };
    fetchData();
    const updateData = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          studentApi.update(studentTable.value).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              fetchData();
              dialogFormVisible.value = false;
            } else {
              ElMessage({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          console.log("error submit!!!");
          return false;
        }
      });
    };
    const handleCurrentChange = (pageNumber: number) => {
      // 改变默认的页数
      formState.currentPage = pageNumber;
      fetchData();
    };
    const handleSizeChange = (side: number) => {
      // 改变每页显示的条数
      formState.pageSize = side;
      // 在改变每页显示的条数时，要将页码显示到第一页
      formState.currentPage = 1;
      fetchData();
    };
    const showNoData = ref("没有查询到数据");
    const indexMethod = (index: number) => {
      return index + 1 + (formState.currentPage - 1) * formState.pageSize;
    };
    const value=ref(2);
    

    return {
      value,
      searchMap,
      roleOptions,
      roleOptions2,
      searchData,
      searchForm,
      roleFilter,
      roleFilter2,
      InfoFilled,
      dialogFormVisible,
      studentTable,
      updateData,
      studentForm,
      handleCurrentChange,
      handleSizeChange,
      formState,
      showNoData,
      indexMethod,
      dialogTeacherVisible,
      resetForm,
      colors,
    };
  },
});
</script>
<style lang="scss" scoped>
.levelVue {
  margin-top: 20px;
}
.levelVue-form{
   display: flex;
   align-items: center;
   justify-content: center;
   margin-right:240px;
   .levelVue-button{
       margin-left:20px;
   }
}
.el-form-item__content{
    margin-left:200px;
}
.el-table__cell p {
  margin-left: 60px;
}
.levelVue-divider {
  height: 30px;
  margin-left: -19px;
  margin-right: 13px;
  margin-top: -16px;
}
.page-demo__paginationTool {
  margin-top: 20px;
  margin-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .page-demo__totalNumber {
    font-size: 14px;
    margin-top: -15px;
  }
  .page-demo__pagination {
    margin-right: 30px;
  }
}
.levelVue-table__score{
    .el-rate__item{
        margin-top:20px;
    }
}
.el-rate{
    height: 25px;
    align-items:normal;
    margin-top:8px;
    font-family:"华文中宋" ;
    line-height: 18px;
}
.el-icon{
    .icon{
        margin-top:20px !important;
    }
}
.levelVue-button__reset{
    margin-left:30px;
}
</style>