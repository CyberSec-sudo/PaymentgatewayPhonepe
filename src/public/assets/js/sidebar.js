function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
  
    // Add a class to the body to adjust content when sidebar is open
    document.body.classList.toggle('sidebar-open');
  }
  