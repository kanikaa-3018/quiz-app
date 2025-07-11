import React, { useEffect, useState } from 'react';
import API from '../lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Edit3,
  Save,
  XCircle,
  Book,
  Award,
  GraduationCap,
  Users,
  Info,
} from 'lucide-react';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        setAdmin(res.data);
        setFormData(res.data);
      } catch (err) {
        alert('Error loading profile');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await API.put('/profile', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setAdmin(res.data);
      setEditMode(false);
    } catch (err) {
      alert('Update failed');
    }
  };

  if (!admin) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Card className="shadow-xl p-8 rounded-3xl bg-white space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
            <User />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold">{admin.name}</h2>
            <p className="text-gray-500">{admin.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">
                <Users className="w-4 h-4 mr-1" /> {admin.studentsTaught} Students
              </Badge>
              {admin.subjects?.map((subject, idx) => (
                <Badge key={idx} className="bg-blue-100 text-blue-800">
                  <Book className="w-3 h-3 mr-1" /> {subject}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!editMode}
          />
          <Input placeholder="Email" value={formData.email || ''} disabled />
          <Input
            placeholder="Students Taught"
            type="number"
            value={formData.studentsTaught || ''}
            onChange={(e) => setFormData({ ...formData, studentsTaught: e.target.value })}
            disabled={!editMode}
          />
          <Input
            placeholder="Subjects (comma-separated)"
            value={formData.subjects?.join(', ') || ''}
            onChange={(e) =>
              setFormData({ ...formData, subjects: e.target.value.split(',').map(s => s.trim()) })
            }
            disabled={!editMode}
          />
        </div>

        <div className="space-y-3">
          <Textarea
            placeholder="Bio"
            rows={3}
            value={formData.bio || ''}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!editMode}
          />

          <Textarea
            placeholder="Experience"
            rows={2}
            value={formData.experience || ''}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            disabled={!editMode}
          />

          <Textarea
            placeholder="Achievements (comma-separated)"
            rows={2}
            value={formData.achievements?.join(', ') || ''}
            onChange={(e) =>
              setFormData({ ...formData, achievements: e.target.value.split(',').map(a => a.trim()) })
            }
            disabled={!editMode}
          />

          <Textarea
            placeholder="Certifications (comma-separated)"
            rows={2}
            value={formData.certifications?.join(', ') || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                certifications: e.target.value.split(',').map(c => c.trim()),
              })
            }
            disabled={!editMode}
          />
        </div>

        <div className="flex justify-between mt-6">
          <Button onClick={() => setEditMode(!editMode)} variant={editMode ? 'ghost' : 'secondary'}>
            {editMode ? (
              <>
                <XCircle className="w-4 h-4 mr-1" /> Cancel
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-1" /> Edit Profile
              </>
            )}
          </Button>
          {editMode && (
            <Button className="btn-primary" onClick={handleUpdate}>
              <Save className="w-4 h-4 mr-1" /> Save Changes
            </Button>
          )}
        </div>
      </Card>

      <div className="mt-8 space-y-4">
        <Card className="p-4 rounded-xl border-l-4 border-green-500 bg-green-50">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center">
            <Award className="w-4 h-4 mr-2" /> Achievements
          </h4>
          <ul className="list-disc list-inside text-sm text-green-800">
            {admin.achievements?.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </Card>

        <Card className="p-4 rounded-xl border-l-4 border-yellow-500 bg-yellow-50">
          <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
            <GraduationCap className="w-4 h-4 mr-2" /> Certifications
          </h4>
          <ul className="list-disc list-inside text-sm text-yellow-800">
            {admin.certifications?.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
