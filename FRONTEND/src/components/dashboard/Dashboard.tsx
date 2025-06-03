import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import TaskBoard from './TaskBoard';
import TaskModal from './TaskModal';
import ThemeToggle from '../common/ThemeToggle';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [imageMetadata, setImageMetadata] = useState<any>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    setShowProfileMenu(false);
    logout();
  };
  
  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
  };
  
  const openProfileImage = () => {
    setShowProfileImage(true);
    fetchImageMetadata();
  };
  
  const closeProfileImage = () => {
    setShowProfileImage(false);
  };
  

  
  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddNewTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (taskId: string) => {
    setSelectedTask(taskId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Generate avatar URL and fetch metadata
  const generateAvatarUrl = () => {
    const seed = user?.username || user?.email || 'default-user';
    const hash = seed.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
    const imageId = hash % 1000;
    
    // Generate different size URLs for navbar thumbnail vs modal display
    return {
      // Higher quality, color image for navbar and dropdown (no blur, no grayscale)
      url: `https://picsum.photos/id/${imageId}/200/200.webp`,
      // Higher resolution for the modal view
      largeUrl: `https://picsum.photos/id/${imageId}/800/800.webp`,
      id: imageId
    };
  };
  
  const avatar = generateAvatarUrl();
  
  // Fetch image metadata when opening the profile image modal
  const fetchImageMetadata = async () => {
    try {
      const response = await fetch(`https://picsum.photos/id/${avatar.id}/info`);
      if (response.ok) {
        const data = await response.json();
        setImageMetadata(data);
      }
    } catch (error) {
      console.error('Error fetching image metadata:', error);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}></div>
          <h1>TasksBoard</h1>
        </div>
        
        <div className={styles.userMenu}>
          <div className={styles.profileContainer} ref={profileMenuRef}>
            <button 
              className={styles.avatarButton}
              onClick={toggleProfileMenu}
              aria-label="Open profile menu"
            >
              <img
                src={avatar.url}
                alt="Profile"
                className={styles.avatar}
                aria-label="Toggle profile menu"
              />
            </button>
            
            {showProfileMenu && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileHeader}>
                  <button 
                    className={styles.avatarExpandButton} 
                    onClick={openProfileImage}
                    aria-label="View full profile picture"
                  >
                    <img src={avatar.url} alt="Profile" className={styles.dropdownAvatar} />
                  </button>
                  <div className={styles.profileInfo}>
                    <p className={styles.profileName}>{user?.username || user?.email}</p>
                    <p className={styles.profileEmail}>{user?.email}</p>
                  </div>
                </div>
                <div className={styles.profileMenuItems}>
                  <button className={styles.profileMenuItem}>
                    My Profile
                  </button>
                  <button className={styles.profileMenuItem}>
                    Settings
                  </button>
                  <button onClick={handleSignOut} className={styles.profileMenuItem}>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.dashboardLayout}>
          <div className={styles.mainTaskArea}>
            <TaskBoard onAddTask={handleAddNewTask} onEditTask={handleEditTask} />
          </div>
        </div>
      </main>

      {isModalOpen && (
        <TaskModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          taskId={selectedTask} 
        />
      )}

      {/* Profile Image Modal */}
      {showProfileImage && (
        <div className={styles.profileImageModal} onClick={closeProfileImage}>
          <div className={styles.profileImageContainer}>
            <button 
              className={styles.closeButton} 
              onClick={closeProfileImage}
              aria-label="Close profile image"
            >
              ✕
            </button>
            <img 
              src={avatar.largeUrl} 
              alt={user?.username || 'User profile'} 
              className={styles.fullProfileImage} 
            />
            
            {imageMetadata && (
              <div className={styles.imageMetadata}>
                <h3>Image Information</h3>
                <p><strong>Author:</strong> {imageMetadata.author}</p>
                <p><strong>Dimensions:</strong> {imageMetadata.width} x {imageMetadata.height}</p>
                <p><strong>URL:</strong> <a href={imageMetadata.url} target="_blank" rel="noopener noreferrer">Original Image</a></p>
                <p className={styles.imageCredit}>Powered by Picsum Photos</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
