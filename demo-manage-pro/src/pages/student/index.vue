<template>
  <div class="studentVue">
    <!-- 条件查询控件 -->
    <el-form
      :inline="true"
      :model="search"
      ref="searchForm"
      style="margin-top: 20px"
    >
      <el-form-item prop="jobNumber">
        <el-input v-model="search.jobNumber" placeholder="工号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="search.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item prop="mentor">
        <el-input
          v-model="search.mentor"
          placeholder="导师"
        ></el-input>
      </el-form-item>
      <el-form-item prop="department">
        <el-select v-model="search.department" placeholder="部门">
          <el-option
            v-for="option in roleOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增 </el-button>
        <el-button type="primary" @click="resetForm(searchForm)"
          >重置
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="studentVue__table">
      <el-table
        :data="formState.list"
        border
        style="width: 100%"
        :empty-text="showNoData"
      >
        <el-table-column
          type="index"
          label="序号"
          width="100"   
          :index="indexMethod"
        ></el-table-column>
        <el-table-column prop="jobNumber" label="工号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
       
        <el-table-column prop="mentor" label="导师" >
        </el-table-column> 
        <el-table-column prop="department" label="部门">
          <template #default="scope">
            <span>{{ roleFilter(scope.row.department) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="enterDate" label="入职日期" >
        </el-table-column> 
        <el-table-column prop="testDate" label="答辩日期" >
        </el-table-column> 
        <el-table-column prop="phoneNumber" label="手机号码"></el-table-column>
        <el-table-column label="操作" >
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row._id)"
              >编辑
            </el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="red"
              title="确定要删除此条信息吗?"
              @confirm="confirmEvent(scope.row._id)"
              @cancel="cancelEvent"
            >
              <template #reference>
                <el-button size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增员工弹窗 -->
    <el-dialog
      title="员工编辑"
      v-model="dialogFormVisible"
      width="460px"
      class="studentVue-dialog"
    >
      <el-form
        :model="studentTable"
        status-icon
        :rules="rules"
        ref="studentForm"
        label-width="90px"
        label-position="right"
        style="width: 309px"
      >
        <el-form-item label="工号" prop="jobNumber">
          <el-input
            autocomplete="off"
            v-model="studentTable.jobNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input autocomplete="off" v-model="studentTable.name"></el-input>
        </el-form-item>
        <el-form-item label="导师" prop="mentor">
          <el-input autocomplete="off" v-model="studentTable.mentor" @click="editOptionTeacher"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="studentTable.department" placeholder="请点击选择">
            <el-option
              v-for="option in roleOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期" prop="enterDate">
          <el-date-picker
            value-format="YYYY/MM/DD"
            v-model="studentTable.enterDate"
            type="date"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="答辩日期" prop="testDate">
          <el-date-picker
            value-format="YYYY/MM/DD"
            v-model="studentTable.testDate"
            type="date"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input
            autocomplete="off"
            v-model="studentTable.phoneNumber"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              studentTable._id === null
                ? addData(studentForm)
                : updateData(studentForm)
            "
            >确 定
          </el-button>
        </span></template
      >
    </el-dialog>
    <!-- 分页模板 -->
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
    <!-- 选择导师弹窗 -->
    <el-dialog title="选择导师" v-model="dialogTeacherVisible" width="500px">
            <teacherVue :isDialog='true' @option-teacher="optionTeacher"></teacherVue>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  reactive,
  ref,
  toRefs,
} from "vue";
import studentApi from "../../api/student";
import teacherVue from "../teacher/index.vue"
import { ElForm, ElMessage } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";

type FormInstance = InstanceType<typeof ElForm>;
const searchForm = ref<FormInstance>();
const studentForm = ref<FormInstance>();
export default defineComponent({
  name: "studentVue",
  components: {
    InfoFilled,
    teacherVue
  },
  setup(props, context) {
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
    const dialogFormVisible = ref(false);
    const formState = reactive({
      total: 0,
      currentPage: 1,
      pageSize: 10,
      list: [],
    });
    const search = reactive({
      jobNumber: "",
      name: "",
      department: "",
      mentor: "",
      mentorId:""
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
      mentorId:""
    });
    const rules = reactive({
      jobNumber: [
        { required: true, message: "请输入该员工工号", trigger: "blur" },
      ],
      name: [{ required: true, message: "请输入该员工姓名", trigger: "blur" }],
      department: [
        {
          required: true,
          trigger: "blur",
          message: "请输入该员工所在部门",
        },
      ],
      enterDate: [
        {
          required: true,
          trigger: "blur",
          message: "请填写该员工的入职日期",
        },
      ],
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
    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };
    const searchData = () => {
      formState.currentPage = 1;
      fetchData();
    };
    const fetchData = () => {
      studentApi
        .search(formState.currentPage, formState.pageSize, search)
        .then((response) => {
          const resp = response.data;
          formState.total = resp.data.total;
          formState.list = resp.data.rows;
        });
    };
    fetchData();

    const handleAdd = () => {
      dialogFormVisible.value = true;
      nextTick(() => {
        resetForm(studentForm.value);
      });
    };
    const addData = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          studentApi.add(studentTable.value).then((response) => {
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
    const handleEdit = (id: any) => {
      handleAdd();
      studentApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          studentTable.value = resp.data;
        }
      });
    };
    const confirmEvent = (id: any) => {
      studentApi.deleteById(id).then((response) => {
        const resp = response.data;
        ElMessage({
          type: resp.flag ? "success" : "error",
          message: resp.message,
        });
        if (resp.flag) {
          fetchData();
        }
      });
    };
    const cancelEvent = () => {
      ElMessage({
        type: "warning",
        message: "已取消删除",
      });
    };
    // 显示第几页
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
    const optionTeacher=(currentRow:any)=>{
                if(isEdit.value){
                    studentTable.value.mentor = currentRow.name;
                    studentTable.value.mentorId = currentRow.id
                }else{
                    search.mentor = currentRow.name;
                    search.mentorId = currentRow.id;
                    dialogFormVisible.value = false;
                }
                    isEdit.value = false;
                    dialogTeacherVisible.value = false;
            }
    const editOptionTeacher=()=>{
        isEdit.value = true;
        dialogTeacherVisible.value = true;
    }
    return {
      roleOptions,
      search,
      handleAdd,
      resetForm,
      searchData,
      searchForm,
      rules,
      roleFilter,
      handleEdit,
      InfoFilled,
      cancelEvent,
      confirmEvent,
      dialogFormVisible,
      studentTable,
      addData,
      updateData,
      studentForm,
      handleCurrentChange,
      handleSizeChange,
      formState,
      showNoData,
      indexMethod,
      dialogTeacherVisible,
      optionTeacher,
      editOptionTeacher
    };
  },
});
</script>
<style lang="scss" scoped>
.page-demo__paginationTool {
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
.studentVue__table {
  margin-bottom: 20px;
}
.studentVue .el-dialog {
  .el-form {
    margin-left: 20px;
    margin-top: 10px !important;
    margin-bottom:10px;
  }
}
</style>