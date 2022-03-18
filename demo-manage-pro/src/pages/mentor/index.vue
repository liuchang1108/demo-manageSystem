<template>
  <div class="teacherVue">
    <!-- 条件查询控件 -->
    <el-form
      :inline="true"
      :model="searchMap"
      ref="searchForm"
      style="margin-top: 20px"
    >
      <el-form-item prop="jobNumber">
        <el-input
          v-model="searchMap.jobNumber"
          placeholder="工号"
          v-if="!isDialog"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item prop="department">
        <el-select
          v-model="searchMap.department"
          placeholder="部门"
          v-if="!isDialog"
        >
          <el-option
            v-for="option in roleOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="departmentStu">
        <el-input
          v-model="searchMap.departmentStu"
          placeholder="实习学员"
          v-if="!isDialog"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button v-if="!isDialog" type="primary" @click="handleAdd"
          >新增
        </el-button>
        <el-button
          v-if="!isDialog"
          type="primary"
          @click="resetForm(searchForm)"
          >重置
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="teacherVue__table">
      <el-table
        :data="formState.list"
        border
        style="width: 100%"
        :highlight-current-row="isDialog"
        @current-change="clickCurrentChange"
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
        <el-table-column prop="department" label="部门" v-if="!isDialog">
          <template #default="scope">
            <span>{{ roleFilter(scope.row.department) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="departmentStu" label="实习学员" v-if="!isDialog">
        </el-table-column>
        <el-table-column prop="phoneNumber" label="手机号码"></el-table-column>
        <el-table-column label="操作" v-if="!isDialog">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row._id)" plain
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
                <el-button size="small" type="danger" plain>删除</el-button>
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
      width="440px"
      class="teacherVue-dialog"
    >
      <el-form
        :model="teacher"
        status-icon
        :rules="rules"
        ref="teacherForm"
        label-width="90px"
        label-position="right"
        style="width: 309px"
      >
        <el-form-item label="工号" prop="jobNumber">
          <el-input autocomplete="off" v-model="teacher.jobNumber"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input autocomplete="off" v-model="teacher.name"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="teacher.department" placeholder="请点击选择">
            <el-option
              v-for="option in roleOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实习学员" prop="departmentStu">
          <el-input
            autocomplete="off"
            v-model="teacher.departmentStu"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input autocomplete="off" v-model="teacher.phoneNumber"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              teacher._id === null
                ? addData(teacherForm)
                : updateData(teacherForm)
            "
            >确 定
          </el-button>
        </span></template
      >
    </el-dialog>
    <!-- 分页模板 -->
    <div class="teacherVue__paginationTool">
      <div class="teacherVue__totalNumber">共{{ formState.total }}条数据</div>
      <div class="teacherVue__pagination">
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
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  reactive,
  ref,
  toRefs,
} from "vue";
import teacherApi from "../../api/mentor";
import { ElForm, ElMessage } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";

type FormInstance = InstanceType<typeof ElForm>;
const searchForm = ref<FormInstance>();
const teacherForm = ref<FormInstance>();
export default defineComponent({
  name: "teacherVue",
  components: {
    InfoFilled,
  },
  props: {
    isDialog: Boolean,
  },
  setup(props, context) {
    const { ctx: _this }: any = getCurrentInstance();

    const { isDialog } = toRefs(props);
    isDialog.value = false;
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
    const searchMap = reactive({
      jobNumber: "",
      name: "",
      department: "",
      departmentStu: "",
    });
    const teacher = ref({
      _id: null,
      jobNumber: "",
      name: "",
      department: "",
      departmentStu: "",
      phoneNumber: "",
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
      teacherApi
        .search(formState.currentPage, formState.pageSize, searchMap)
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
        resetForm(teacherForm.value);
        _this.$forceUpdate();
      });
    };
    const addData = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          teacherApi.add(teacher.value).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              fetchData();
              dialogFormVisible.value = false;
              _this.$forceUpdate();
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
          teacherApi.update(teacher.value).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              fetchData();
              dialogFormVisible.value = false;
              _this.$forceUpdate();
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
      teacherApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          teacher.value = resp.data;
        }
      });
      _this.$forceUpdate();
    };
    const confirmEvent = (id: any) => {
      teacherApi.deleteById(id).then((response) => {
        const resp = response.data;
        ElMessage({
          type: resp.flag ? "success" : "error",
          message: resp.message,
        });
        if (resp.flag) {
          fetchData();
          _this.$forceUpdate();
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
    const clickCurrentChange = (currentRow: any) => {
      console.log(currentRow);
      context.emit("option-teacher", currentRow);
    };
    const showNoData = ref("没有查询到数据");
    const indexMethod = (index: number) => {
      return index + 1 + (formState.currentPage - 1) * formState.pageSize;
    };
    return {
      roleOptions,
      searchMap,
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
      teacher,
      addData,
      updateData,
      teacherForm,
      handleCurrentChange,
      handleSizeChange,
      formState,
      clickCurrentChange,
      showNoData,
      indexMethod,
    };
  },
});
</script>
<style lang="scss" scoped>
.el-dialog {
  .el-form {
    margin-left: 10px;
    margin-top: -5px !important;
    margin-bottom: 10px;
  }
}
.teacherVue__paginationTool {
  margin-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .teacherVue__totalNumber {
    font-size: 14px;
    margin-top: -10px;
  }
  .teacherVue__pagination {
    margin-right: 30px;
  }
}
.teacherVue__table {
  margin-bottom: 20px;
}
</style>