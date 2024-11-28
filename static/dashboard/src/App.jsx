const App = () => {
  const [templates, setTemplates] = useState([]);
  const [me, setMe] = useState(null);
  const [saving, setIsSaving] = useState(false);
  const [newList, setNewList] = useState({ name: "", items: [] });
  const [newListName, setNewListName] = useState("");
  const [newListItems, setNewListItems] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [isEditModal, setIsEditable] = useState(false);
  const [editList, setEditList] = useState({});
  const [newItemText, setNewItemText] = useState(""); // For adding new items

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const userData = await invoke("getMyself");
        setMe({
          name: userData?.data?.displayName,
          email: userData?.data?.emailAddress,
        });

        const allTemplates = await invoke("getTemplates", {
          currentRoute: window.location.href,
        });

        if (Array.isArray(allTemplates)) {
          setTemplates(allTemplates);
        } else {
          console.error("Invalid templates data:", allTemplates);
          throw new Error("Templates data is not an array.");
        }
      } catch (error) {
        console.error("Error fetching user data or templates:", error);
        toast.error("Error loading templates.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (!newList.name.trim() || newList.items.length === 0) {
      toast.error("Please enter a list name and items.");
      setIsSaving(false);
      return;
    }

    const updatedList = {
      ...newList,
      items: [...newList.items], // Ensure tasks with updated statuses are included
      owner: me,
    };

    const allTemplates = selectedTemplate?.id
      ? templates.map((template) =>
          template.id === selectedTemplate.id
            ? { ...template, ...updatedList }
            : template
        )
      : [...templates, { ...updatedList, id: Date.now(), owner: me }];

    setTemplates(allTemplates);

    try {
      const response = await invoke("setTemplates", {
        currentRoute: window.location.href,
        templates: allTemplates,
      });

      if (response?.success) {
        toast.success("List saved successfully.");
      } else {
        toast.error("Failed to save the list.");
      }
    } catch (error) {
      console.error("Error saving the list:", error);
      toast.error("Error saving the list.");
    } finally {
      setIsSaving(false);
      handleClear();
    }
  };

  const handleDeleteList = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to clear that task?"
    );

    if (!confirmation) {
      return;
    }

    const updatedTemplates = templates.filter(
      (template) => template.id !== id
    );
    setTemplates(updatedTemplates);

    try {
      const response = await invoke("setTemplates", {
        currentRoute: window.location.href,
        templates: updatedTemplates,
      });

      if (response?.success) {
        toast.success("List deleted successfully.");
      } else {
        toast.error("Failed to delete the list.");
      }
    } catch (error) {
      toast.error("Error deleting the list.");
    }
  };

  const handleClear = () => {
    setNewListName("");
    setNewListItems("");
    setNewList({ name: "", items: [] });
  };

  const addListItems = () => {
    if (!newListItems.trim()) {
      toast.error("Please enter an item.");
      return;
    }
    setNewList((prevList) => ({
      ...prevList,
      name: newListName.trim(),
      items: [
        ...prevList.items,
        { text: newListItems.trim(), status: "To Do", checked: false },
      ],
    }));
    setNewListItems("");
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setEditList(template); // Set selected template as the editList
    setIsEditable(true); // Enable edit mode
    setIsModal(true); // Open the modal
  };

  const removeItem = (index) => {
    const updatedItems = editList.items.filter((_, i) => i !== index);
    setEditList((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addNewItemToEditList = () => {
    if (!newItemText.trim()) {
      toast.error("Please enter a valid item text.");
      return;
    }
    const updatedItems = [...editList.items, { text: newItemText.trim() }];
    setEditList((prev) => ({
      ...prev,
      items: updatedItems,
    }));
    setNewItemText(""); // Clear the new item input field
  };

  const handleSaveEditedTemplate = async () => {
    if (!editList.name.trim() || editList.items.length === 0) {
      toast.error("Please enter a list name and items.");
      return;
    }

    const updatedList = {
      name: editList.name.trim(),
      items: [...editList.items],
      owner: me,
    };

    const updatedTemplates = templates.map((template) =>
      template.id === selectedTemplate.id
        ? { ...template, ...updatedList }
        : template
    );

    setTemplates(updatedTemplates);
    setIsSaving(false);
    setIsEditable(false); // Disable edit mode
    setIsModal(false); // Close the modal

    try {
      const response = await invoke("setTemplates", {
        currentRoute: window.location.href,
        templates: updatedTemplates,
      });

      if (response?.success) {
        toast.success("Template updated successfully.");
      } else {
        toast.error("Failed to update the template.");
      }
    } catch (error) {
      toast.error("Error updating the template.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    const updatedTasks = newList.items.map((task) =>
      task.id === id ? { ...task, status, checked: status === "Done" } : task
    );

    setNewList((prevList) => ({
      ...prevList,
      items: updatedTasks,
    }));

    await invoke("setTasks", { issueKey: newList.name, tasks: updatedTasks });
    toast.success("Status updated successfully.");
  };

  const handleDeleteTask = async (id) => {
    const updatedTasks = newList.items.filter((task) => task.id !== id);
    setNewList((prevList) => ({
      ...prevList,
      items: updatedTasks,
    }));

    await invoke("setTasks", { issueKey: newList.name, tasks: updatedTasks });
    toast.success("Task deleted successfully.");
  };

  return (
    <>
      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title={selectedTemplate?.name || "Template Details"}
      >
        {isEditModal ? (
          <>
            <h4 className="text-lg font-medium">Edit Template Name:</h4>
            <input
              type="text"
              value={editList.name || ""}
              onChange={(e) =>
                setEditList((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="border px-2 py-1 rounded-md w-full mb-4"
            />

            <h4 className="text-lg font-medium">Edit Items:</h4>
            {editList.items?.length > 0 ? (
             <TaskList
             tasks={editList.items || []}
             onEditTask={(index, newText) => {
               const updatedItems = [...editList.items];
               updatedItems[index].text = newText;
               setEditList((prev) => ({ ...prev, items: updatedItems }));
             }}
             onDeleteTask={removeItem}
             onAddNewItem={addNewItemToEditList}
             newItemText={newItemText}
             setNewItemText={setNewItemText}
           />
            ) : (
              <p>No items available.</p>
            )}

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="border px-2 py-1 rounded-md w-full"
              />
              <button
                onClick={addNewItemToEditList}
                className="bg-blue-500 text-white px-2 py-1 rounded-md"
              >
                Add Item
              </button>
            </div>

            <button
              onClick={handleSaveEditedTemplate}
              disabled={saving}
              className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h4 className="text-lg font-medium">Items:</h4>
            {selectedTemplate?.items?.length > 0 ? (
              <ul className="list-disc ml-5">
                {selectedTemplate.items.map((item, index) => (
                  <li key={index}>{item.text}</li>
                ))}
              </ul>
            ) : (
              <p>No items available.</p>
            )}
          </>
        )}
      </Modal>

      <div className="container">
        <h1>Create a New List</h1>
        <div className="flex w-full">

        </div>

        <div className="templates">
          <h1>My Lists</h1>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-2 py-3 text-left">
                  S.No
                </th>

                <th scope="col" className="px-6 py-3 text-left">
                  Template Name
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Template Owner
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center"></td>
                  <div className="w-full flex justify-center items-center ">
                    <div role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                </tr>
              ) : templates.length > 0 ? (
                templates.map((template, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{index + 1}</td>

                    <td className="px-6 py-4 font-bold text-lg">
                      {template.name.length > 90
                        ? template.name.slice(0, 80) + "..."
                        : template.name}
                    </td>
                    <td className="px-6 py-4">{template.owner.name}</td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewTemplate(template)}
                        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                      >
                        view
                      </button>
                      {template.owner.email === me.email && (
                        <>
                          <button
                            onClick={() => handleDeleteList(template.id)}
                            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                          >
                            delete
                          </button>
                          <button onClick={() => handleEditTemplate(template)}>
                            edit
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <div>No templates found</div>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
