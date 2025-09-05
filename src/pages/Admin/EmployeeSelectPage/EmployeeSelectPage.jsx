import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spin, Button, Table, message, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedEmployees } from "../../../redux/slices/projectSlice";
import * as EmployeeService from "../../../services/UserService";

export default function UsersByProjectPage() {
  const { id, mode } = useParams(); // mode = view | add | edit
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pageSize: 8 });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const selectedEmployees = useSelector(
    (state) => state.project?.selectedEmployees || []
  );

  // ================== Fetch data ==================
  const fetchData = async (page = 1, pageSize = 8, search = "") => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("=== FetchData START ===");
      console.log("Mode:", mode, "| Page:", page, "| Limit:", pageSize, "| Search:", search);

      if (mode === "add" || mode === "edit") {
        const res = await EmployeeService.getAllUser(user?.access_token, {
          page,
          limit: pageSize,
          search,
        });

        console.log("Raw response (add/edit):", res);

        let userList = [];
        let totalCount = 0;
        let currentPage = page;
        let currentLimit = pageSize;

        if (Array.isArray(res)) {
          userList = res;
          if (search) {
            const searchLower = search.toLowerCase();
            userList = userList.filter(u =>
              u.name?.toLowerCase().includes(searchLower) ||
              u.email?.toLowerCase().includes(searchLower)
            );
          }
          totalCount = userList.length;
          userList = userList.slice((page - 1) * pageSize, page * pageSize);
        } else if (res?.success) {
          userList = res.data || [];
          totalCount = res.total || userList.length;
          currentPage = res.page || page;
          currentLimit = res.limit || pageSize;
        }

        console.log("Final userList (add/edit):", userList);

        setUsers(userList);
        setPagination({ total: totalCount, page: currentPage, pageSize: currentLimit });

        // Giữ selectedRowKeys cho edit
        if (mode === "edit") {
          let initialSelectedIds = [];
          const tempFormData = localStorage.getItem("tempFormData");

          if (tempFormData) {
            try {
              const tempData = JSON.parse(tempFormData);
              if (Array.isArray(tempData.selectedEmployees) && tempData.selectedEmployees.length > 0) {
                if (typeof tempData.selectedEmployees[0] === "string") {
                  initialSelectedIds = tempData.selectedEmployees;
                } else {
                  initialSelectedIds = tempData.selectedEmployees.map((e) => e.id);
                }
              }
            } catch (e) {
              console.error("Error parsing tempFormData:", e);
            }
          }

          if (!initialSelectedIds.length && selectedEmployees.length > 0) {
            if (typeof selectedEmployees[0] === "string") {
              initialSelectedIds = selectedEmployees;
            } else {
              initialSelectedIds = selectedEmployees.map((e) => e.id);
            }
          }

          if (!initialSelectedIds.length && id && id !== "new") {
            try {
              const projectRes = await EmployeeService.getUsersByProject(
                id,
                user?.access_token
              );
              console.log("Response getUsersByProject (edit):", projectRes);
              if (projectRes?.success && projectRes.data) {
                initialSelectedIds = projectRes.data.map((e) => e.id);
              }
            } catch (error) {
              console.error("Error fetching project employees:", error);
            }
          }

          console.log("Initial selectedRowKeys (edit):", initialSelectedIds);
          setSelectedRowKeys(initialSelectedIds);
        }
      }

      if (mode === "view" && id) {
        const res = await EmployeeService.getUsersByProject(
          id,
          user?.access_token,
          { page, limit: pageSize, search }
        );

        console.log("Raw response (view):", res);

        if (res?.success) {
          setUsers(res.data || []);
          console.log("Final userList (view):", res.data || []);

          setPagination({
            total: res.total || (res.data || []).length,
            page: res.page || page,
            pageSize: res.limit || pageSize
          });
        }
      }

      console.log("=== FetchData END ===");
    } catch (err) {
      console.error("FetchData error:", err);
      message.error("Có lỗi khi gọi API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, pagination.pageSize);
  }, [id, mode]);

  // Sync Redux
  useEffect(() => {
    if (mode === "edit" && selectedEmployees.length > 0) {
      let reduxSelectedIds = [];
      if (typeof selectedEmployees[0] === "string") {
        reduxSelectedIds = selectedEmployees;
      } else if (typeof selectedEmployees[0] === "object" && selectedEmployees[0]?.id) {
        reduxSelectedIds = selectedEmployees.map(e => e.id);
      }
      console.log("Sync Redux selectedEmployees:", reduxSelectedIds);
      setSelectedRowKeys(reduxSelectedIds);
    }
  }, [selectedEmployees, mode]);

  // ================== Columns ==================
  const columns = [
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Tên nhân viên", dataIndex: "name", key: "name" },
    {
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      render: (roles) => Array.isArray(roles) ? roles.join(", ") : roles
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/detail/user/${record.id}`)}>
          Xem chi tiết
        </Button>
      ),
    }
  ];

  // Debug state
  useEffect(() => {
    console.log("=== UsersByProjectPage State ===");
    console.log("Users length:", users.length);
    console.log("Users:", users);
    console.log("SelectedRowKeys:", selectedRowKeys);
    console.log("Redux selectedEmployees:", selectedEmployees);
    console.log("Mode:", mode);
  }, [users, selectedRowKeys, selectedEmployees, mode]);

  return (
    <Card
      title={`Danh sách Nhân viên (${mode})`}
      style={{ margin: 24 }}
    >
      <Spin spinning={loading}>
        <Input
          placeholder="Tìm theo tên hoặc email"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onPressEnter={() => fetchData(1, pagination.pageSize, searchKeyword)}
          style={{ width: 300, height: 40, marginBottom: 16 }}
        />
        <Table
          dataSource={users}
          rowKey={(record) => record.id || record._id} // ✅ an toàn hơn
          size="small"
          rowSelection={
            mode === "add" || mode === "edit"
              ? {
                selectedRowKeys,
                onChange: setSelectedRowKeys,
                type: "checkbox"
              }
              : undefined
          }
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => fetchData(page, pageSize, searchKeyword),
            showTotal: (total) => `Tổng ${total} nhân viên`
          }}
          columns={columns}
        />
      </Spin>
    </Card>
  );
}
